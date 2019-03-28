const request = require('request')
const BTC_DUST = 0.0000542
const TRANSFER_FEE = 0.00030000
const OP_RETURN_PREFIX = "OP_RETURN 28 0x"
const PREFIX = "434e54525052545900000000"
const BigInteger = require('./lib/bigint').BigInteger
const bitcore = require('bitcore-lib')

module.exports = {

    createEndpoint: function(action, poi){
        switch(action) {
            case "info": 
                return {url: 'https://xchain.io/api/asset/' + poi}
            case "utxo":
                return {url: 'https://insight.bitpay.com/api/addr/'+ poi +'/utxo'}
            case "push": 
                return [
                    {url: "https://chain.so/api/v2/send_tx/BTC", form: {"network": "BTC", "tx_hex": poi}},
                    {url: "http://blockchain.info/pushtx", form: {"tx":  poi}},
                    {url: "http://btc.blockr.io/api/v1/tx/push", form: {"hex": poi}}
                ]
        }
    },
    
    getAsset: function(assetName, cb){
        return this.get(this.createEndpoint('info', assetName), (asset)=>{
            asset.toSmalletsUnits = function(units){
                if (!this.divisible) {
                    return parseFloat(parseFloat(units) / 100000000)
                } else {
                    return parseFloat(units)
                }
            }
            return cb(asset)
        })
    },

    getUTXO: function(address, cb){
        return this.get(this.createEndpoint('utxo', address), (info)=>{
            data = info.sort(function(a, b) {
                return b.amount - a.amount;
            })
            return cb(data)
        })
    },

    pushTransaction: function(transaction, cb){
        var transactionHex = transaction.uncheckedSerialize()
        this.pushTransactionHex(transactionHex, cb)
    },

    pushTransactionHex: function(transactionHex, cb){
        var endpoints = this.createEndpoint("push", transactionHex)
        var complete = 0
        var bodies =[]
        endpoints.forEach(endpoint=>{
            this.post(endpoint, (body)=>{
                bodies.push(body)
                complete = complete + 1
                if (complete === endpoints.length) {
                    return cb(bodies)
                }
            })
        })        
    },

    get: function(endpoint, cb){
        request.get(endpoint, (code, response, body)=>{
            return cb(JSON.parse(body))
        })
    },

    post: function(endpoint, cb){
        request.post(endpoint, (code, response, body)=>{
            if (!body) body = "{}"
            return cb(JSON.parse(body))
        })
    },

    createTransaction(fromAddress, toAddress, assetName, amount, cb){
        this.createTransactionFromAddress(fromAddress, transactionObject=>{
            if (transactionObject.error) return cb({error: transactionObject.error})
            transactionObject.transaction.to(toAddress, this.roundedSatoshi(BTC_DUST))
            this.createOpReturnScript(amount, assetName, transactionObject.key, opReturnScript=>{
                transactionObject.transaction.addOutput(opReturnScript)
                return cb(transactionObject)
            })
            
        })
    },

    signTransaction(transaction, key, cb){
        return cb(transaction.sign(key))
    },

     createTransactionFromAddress(fromAddress, cb){
        this.getUTXO(fromAddress, utxoList=>{
            this.createUtxoForSpending(utxoList, spendUtxoList=>{
                if (spendUtxoList.error) return cb({error: spendUtxoList.error})
                this.createTransactionFromSpendUtxo(spendUtxoList.spend, transaction=>{
                    if (spendUtxoList.change) transaction.change(fromAddress)
                    return cb({remaining: spendUtxoList.remaining, transaction: transaction, key: spendUtxoList.spend[0].txid})
                })
            })            
        })
    },

    createUtxoForSpending(utxoList, cb) {
        var spendList = []
        utxoNeeded = 0
        utxoList.forEach(utxo=>{
            return this.remainingUtxoNeeded(utxoNeeded, utxo.amount, (remaining)=>{
                utxoNeeded = remaining
                spendList.push({
                    "txid": utxo.txid,
                    "address": utxo.address,
                    "vout": utxo.vout,
                    "scriptPubKey": utxo.scriptPubKey,
                    "amount": utxo.amount
                })
                if (remaining === 0 || remaining < -0.00005460) {
                    var change = -(remaining.toFixed(8) * 100000000).toFixed(0)
                    return cb({
                        spend: spendList,
                        remaining: remaining,
                        change: change
                    })
                } else if(spendList.length === utxoList.length) {
                    var change = -(remaining.toFixed(8) * 100000000).toFixed(0)
                    return cb({
                        spend: spendList,
                        remaining: remaining,
                        change: change
                    })
                }
            })
        })        
    },

    createTransactionFromSpendUtxo(utxoList, cb) {
        var transaction = new bitcore.Transaction()
        utxoList.forEach(utxo=>{
            transaction.from(utxo)
        })
        return cb(transaction)
    },

    encodeOpReturnData(total, assetName, cb){
        this.encodeAssetId(assetName, (asset_id)=>{
            var asset_id_hex = this.sizedPadPrefix(asset_id, 16).toLowerCase()
            var amount_round = this.roundedSatoshi(total)
            var amount_hex = this.sizedPadPrefix(amount_round, 16).toLowerCase()
            return cb((PREFIX + asset_id_hex + amount_hex).toLowerCase())
        })
    },

    createOpReturnScriptFromEncrypted(encodedData, cb){
        var scriptString = OP_RETURN_PREFIX + encodedData
        var script = new bitcore.Script(scriptString)
        var op_return = new bitcore.Transaction.Output({script: script, satoshis: 0})
        return cb(op_return)
    },

    createOpReturnScript(total, assetName, key, cb){
        this.encodeOpReturnData(total, assetName, encodedData=>{
            var encrypted = this.rc4Encrypt(key, encodedData)
                this.createOpReturnScriptFromEncrypted(encrypted, script=>{
                    return cb(script)
                })
        })
    },



    encodeAssetId(assetName, cb) {
        var asset_id
        if (assetName == "XCP") {
            asset_id = (1).toString(16)
        }
        else {
            var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            var name_array = assetName.split("")
            var n_bigint = BigInteger(0)
        
            for (i = 0; i < name_array.length; i++) { 
                n_bigint = BigInteger(n_bigint).multiply(26)
                n_bigint = BigInteger(n_bigint).add(b26_digits.indexOf(name_array[i]))
            }
            var asset_id = n_bigint.toString(16)
        }
        return cb(asset_id)
    },

    remainingUtxoNeeded(remaining, amount, cb){
        if (!remaining || remaining === 0) {
            remaining = parseFloat((parseFloat(BTC_DUST) * 100000000) + (parseFloat(TRANSFER_FEE)*100000000))/100000000
        }
        if (amount && amount > 0) {
            remaining = (remaining - amount)//.toFixed(8)
        }
        return cb(remaining)
    },

    sizedPadPrefix(poi, size){
        if (!size) return this.sizedPadPrefix(poi, 16)
        return this.padPrefix(poi.toString(size), size)
    },

    padPrefix(str, max) {   
        str = str.toString()
        return str.length < max ? this.padPrefix('0' + str, max) : str
    },

    roundedSatoshi(amount){
        return parseInt((amount*100000000).toFixed(0))
    },

    rc4Encrypt(key, data){
        return this.bin2hex(this.rc4(this.hex2bin(key), this.hex2bin(data)))
    },

    bin2hex(s) {
        var i, l, o = "",
                n
        s += ""
        for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
        }
        return o    
    },
    hex2bin(hex) {
        var bytes = []
        var str
        for (var i = 0; i < hex.length - 1; i += 2) {
                var ch = parseInt(hex.substr(i, 2), 16)
                bytes.push(ch)
        }
        str = String.fromCharCode.apply(String, bytes)
        return str
    },

    rc4(key, str) {
	
        //https://gist.github.com/farhadi/2185197
        
        var s = [], j = 0, x, res = '';
        for (var i = 0; i < 256; i++) {
            s[i] = i;
        }
        for (i = 0; i < 256; i++) {
            j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
        }
        i = 0;
        j = 0;
        for (var y = 0; y < str.length; y++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            x = s[i];
            s[i] = s[j];
            s[j] = x;
            res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
        }
        return res;
        
    }
}