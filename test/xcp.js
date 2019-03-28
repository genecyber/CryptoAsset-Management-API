var {describe, it} = require('mocha')
const chai = require('chai')
const expect = chai.expect
const sweep = require('../index')
const mocks = require('./mocks')

describe('suite', ()=>{
    it('gets asset info from API', (done)=>{
        const poi = mocks.asset_info.keys.divisible_asset
        sweep.getAsset(mocks.asset_info.keys.divisible_asset, (info)=>{
            expect(info.issuer).to.equal(mocks.asset_info.objects[poi].issuer)
            done()
        })
    })

    it('gets asset info object', (done)=>{
        sweep.getAsset(mocks.asset_info.keys.divisible_asset, (asset)=>{
            expect(asset.toSmalletsUnits).to.exist
            done()
        })
    })

    it('returns unchanged dividible asset total', (done)=>{
        sweep.getAsset(mocks.asset_info.keys.divisible_asset, (asset)=>{
            var smallest = asset.toSmalletsUnits(1)
            expect(smallest).to.equal(1)
            done()
        })
    })

    it('returns converted individible asset total', (done)=>{
        sweep.getAsset(mocks.asset_info.keys.indivisible_asset, (asset)=>{
            var smallest = asset.toSmalletsUnits(1)
            expect(smallest).to.equal(.00000001)
            done()
        })
    })

    it('gets utxo from api', (done)=>{
        sweep.getUTXO(mocks.utxo.keys.covaltest, (info)=>{
            expect(info[0].scriptPubKey).to.equal(mocks.utxo.objects.covaltest[0].scriptPubKey)
            done()
        })
    })

    it('gets sorted utxo from api', (done)=>{
        sweep.getUTXO(mocks.utxo.keys.covaltest, (info)=>{
            expect(info[0].amount > info[1].amount).to.be.true
            done()
        })
    })

    it('calculates total utxo needed with no remaining or amount', (done)=>{
        sweep.remainingUtxoNeeded(0, 0, (needed)=>{
            expect(needed).to.eq(0.00035420)
            done()
        })
    })

    it('calculates total utxo when provided remaining & amount', (done)=>{
        sweep.remainingUtxoNeeded(0.00035420, 0.0004458, (needed)=>{
            expect(needed).to.eq(-0.0000916)
            done()
        })
    })

    it('calculates total utxo when provided remaining & amount', (done)=>{
        sweep.remainingUtxoNeeded(0.0003542, 0.0003, (needed)=>{
            expect(needed).to.eq(0.000054200000000000016)
            done()
        })
    })

    it('calculates total utxo when provided remaining & amount', (done)=>{
        sweep.remainingUtxoNeeded(0.000054200000000000016, 0.0000542, (needed)=>{
            expect(needed).to.eq(1.3552527156068805e-20)
            done()
        })
    })

    it('generates spendable utxo list', (done)=>{
        sweep.createUtxoForSpending(mocks.utxo.objects.covaltest, (utxo)=>{
            expect(utxo.spend).to.deep.equal(mocks.utxo_spend.objects.covaltest)
            done()
        })
    })

    it('generates transaction from utxo list', (done)=>{
        sweep.createTransactionFromSpendUtxo(mocks.utxo_spend.objects.covaltest, (transaction)=>{
            expect(transaction.inputs[0].output.satoshis).to.equal(295281)
            done()
        })
    })

    it('encodes asset and amount', (done)=>{
        var amount = "250000"
        sweep.encodeOpReturnData(amount, "COVALC", (encoded)=>{
            expect(encoded).to.equal(mocks.op_return_data.objects.covalc)
            done()
        })
    })

    it('creates valid script', (done)=>{
        sweep.createOpReturnScriptFromEncrypted(mocks.encrypted_op_return_data.objects.covalc, (script)=>{
            expect(script.inspect()).to.equal("<Output (0 sats) <Script: OP_RETURN 28 0xa1a79d28163f03217f6d99fef362b2d13e32cbabc7b5f6aaf896d42e>>")
            done()
        })
    })

    it('rc4 encrypts payload', (done)=>{
        var key = mocks.utxo.objects.covalc.txid
        var data = mocks.op_return_data.objects.covalc
        var encrypted = sweep.rc4Encrypt(key, data)
        expect(encrypted).to.equal(mocks.encrypted_op_return_data.objects.covalc)
        done()
    })

    it('encodes XCP asset ID', (done)=>{
        sweep.encodeAssetId("XCP", (assetId)=>{
            expect(assetId).to.equal("1")
            done()
        })
    })

    it('encodes COVALC asset ID', (done)=>{
        sweep.encodeAssetId("COVALC", (assetId)=>{
            expect(assetId).to.equal("1D1D908")
            done()
        })
    })

    it('pads COVALC encoded asset ID', (done)=>{
        expect(sweep.sizedPadPrefix("1D1D908", 16)).to.eq("0000000001D1D908")
        done()
    })

    it('satoshi rounds', (done)=>{
        var amount = "250000"
        expect(sweep.roundedSatoshi(amount)).to.eq(25000000000000)
        done()
    })

    it('satoshi rounds decimals', (done)=>{
        var amount = "0.0000542"
        expect(sweep.roundedSatoshi(amount)).to.eq(5420)
        done()
    })

    it('hexifies rounded amount', (done)=>{
        var amount = 25000000000000
        expect(sweep.sizedPadPrefix(amount, 16)).to.eq("000016bcc41e9000")
        done()
    })

    it('generates transaction from address', (done)=>{
        sweep.createTransactionFromAddress("1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et", (transactionObject)=>{
            expect(transactionObject.transaction.toString()).to.equal("0100000002fa3154cb9af29171ae16a4efe7427e40c55acea000418c196e708bb95fcdb0800000000000ffffffff5c2c00625ecc345b85d1b8be277f54adc4346e0a7c9d028bb1d09d8d87c9a4980000000000ffffffff0000000000")
            done()
        })
    })

    it('generates complete transaction when provided to, from, asset, amount', (done)=>{
        sweep.createTransaction("1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et","1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et", "COVALTEST", "1", (transactionObject)=>{
            expect(transactionObject.transaction.uncheckedSerialize()).to.equal("0100000002fa3154cb9af29171ae16a4efe7427e40c55acea000418c196e708bb95fcdb0800000000000ffffffff5c2c00625ecc345b85d1b8be277f54adc4346e0a7c9d028bb1d09d8d87c9a4980000000000ffffffff022c150000000000001976a91483a5160a95d691eaca69ee7794f9ef2c9c0394c188ac00000000000000001e6a1cff7c1195a14774758781eda0ddb7783fd6792464f57b91af921401e800000000")
            done()
        })
    })

    it('signs transaction',(done)=>{
        var key = "KxU4oCLx6TUHfPyyS3x16xJebtRHKRS2Xaqa2QfwJGSoz4xaxha3"
        sweep.createTransaction("1BXGS5XMQ3HRv7QECQVxPwdbnpdfryt9uo","16R6okDVoMoDLoSFXRDobntn9R87r2YqHV", "COVALC", "1", (transactionObject)=>{
            sweep.signTransaction(transactionObject.transaction, key, (signed)=>{
                expect(signed.uncheckedSerialize()).to.equal("0100000001b871c7ed769ac7c7b2ce93645770ddaa85afdfc9ed5a60b663701061b4eb8fa4020000006a47304402204d9cf55a0c9dce15d22a1cf31ea7fe62b38f0e2d83ccf85aa1fa2fe7722a230a022006f43556a39435eb2137e754ba7ebb90dd5252340351302cdca3b618ac8579bb01210321c8097c9d33f236a1ae0159edc76f9ebd8caa672a899641a19988101f773fe8ffffffff022c150000000000001976a9143b6775647f994ac1b35f85d1934834e595265a8488ac00000000000000001e6a1ca9aefb27b955e84306ae9de96d546bf12af8573f6b781c4e36665bd500000000")
                done()
            })
        })
    })

    it.skip('pushes transaction', (done)=>{
        sweep.pushTransactionHex("010000000134987f1f58d1f3d968660497ad3864b1d71802c0d9a42e4eb76f1f0ca1d82f31020000006b4830450221009f0d6c121c51d449ce2f34c761901b74e9647d1635133adc8449d5aab6e2e87302205930804a91062c59477781fe61c6ca6979f0e06c3f326e5cf21c879c76a07b3401210384d005cdd18bf6d8eb1eca3092ca1116556307a8cbc48452eb1230df8df43236ffffffff022c150000000000001976a91483a5160a95d691eaca69ee7794f9ef2c9c0394c188ac00000000000000001e6a1ca1a79d28163f03217f6d99fef362b2add0823a7cc7b5e016397da52e00000000", (bodies)=>{
            done()
        })
    })    
})

describe('signer', ()=>{
    var signer = require('../lib/signer')
    it.only('signs transaction using signer', (done)=>{
        var keyHex = "L49W1QHPmq5urH4Xb5A9MTgNa2Bo8JetCbnE2wECaLoLKnUrL2Wg"
        sweep.createTransaction("1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et","1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et", "COVALTEST", "1", (transactionObject)=>{
            signer.signTransaction(transactionObject.transaction, keyHex, (signed)=>{
                expect(signed.uncheckedSerialize()).to.equal("0100000002fa3154cb9af29171ae16a4efe7427e40c55acea000418c196e708bb95fcdb080000000006a473044022030a06d67da7593891b613ddc0fe15d6f2bb4d6e7a04f6b66d4170869d775269e0220012c60295b3786148f8c67eab397732ae511d3f41dd7fae50b36531ca1c0446701210384d005cdd18bf6d8eb1eca3092ca1116556307a8cbc48452eb1230df8df43236ffffffff5c2c00625ecc345b85d1b8be277f54adc4346e0a7c9d028bb1d09d8d87c9a498000000006a47304402203a1d88e12b070aaaf4a65058169b998b58888cbf039caca07ad5b74a53cfef8f02200f8674894f80229e689ed813286730f70416b6c6409a2739db641a26d8f329c301210384d005cdd18bf6d8eb1eca3092ca1116556307a8cbc48452eb1230df8df43236ffffffff022c150000000000001976a91483a5160a95d691eaca69ee7794f9ef2c9c0394c188ac00000000000000001e6a1cff7c1195a14774758781eda0ddb7783fd6792464f57b91af921401e800000000")
                done()
            })
        })
    })
})