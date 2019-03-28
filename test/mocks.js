module.exports = {
    asset_info: {
        keys: {
            divisible_asset: "covalc",
            indivisible_asset: "datboi"
        },
        objects: {
            covalc: {
                asset: 'COVALC',
                asset_id: 30529800,
                asset_longname: '',
                description: 'xcp.coindaddy.io/COVALC.json',
                divisible: true,
                estimated_value: { btc: '0.00000028', usd: '0.00', xcp: '0.00060000' },
                issuer: '1CNmJTbxC3gkg6HvTuVYRYGEsm5JVZfUPQ',
                locked: true,
                owner: '1CNmJTbxC3gkg6HvTuVYRYGEsm5JVZfUPQ',
                supply: '1200000000.00000000',
                type: 'named'
            },
            datboi: {
                "asset": "DATBOI",
                "asset_id": 35979120,
                "asset_longname": "",
                "description": "unicycle not included",
                "divisible": false,
                "estimated_value": { "btc": "0.00000000", "usd": "0.00", "xcp": "0.00000000" },
                "issuer": "1parodyTHe9y2VHk8kZNMZBNTkPTwKj3r",
                "locked": false,
                "owner": "1parodyTHe9y2VHk8kZNMZBNTkPTwKj3r",
                "supply": 222, "type":
                    "named"
            }
        }
    },
    utxo: {
        keys: {
                covalc: "1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et",            
                covaltest: "1CA9TYBviKnEaF4knshApWCKPKwLpssTZP"
        },
        objects: {
            covalc: {
                "address": "1D15HWkr7jU9YaMSFAXFrjVtUAeVFSr7Et",
                "txid": "312fd8a10c1f6fb74e2ea4d9c00218d7b16438ad97046668d9f3d1581f7f9834",
                "vout": 2,
                "scriptPubKey":
                    "76a91483a5160a95d691eaca69ee7794f9ef2c9c0394c188ac",
                "amount": 0.0004458,
                "satoshis": 44580,
                "height": 551472,
                "confirmations": 17131
            },
            covaltest: [{
                address: '1CA9TYBviKnEaF4knshApWCKPKwLpssTZP',
                txid: 'ea10a7590ff99a4b84c6e8f3a441dc2651b7d87e11108b56eedf191008ac0993',
                vout: 1,
                scriptPubKey: '76a9147a642ff1bda1ee266ab5f882dc183b48158178e888ac',
                amount: 0.00295281,
                satoshis: 295281,
                height: 553664
            },
            {
                address: '1CA9TYBviKnEaF4knshApWCKPKwLpssTZP',
                txid: '84c08db98bad04e1922e15c068b0cce2dd425ceb17ef0cdb704ce8b3998cefd9',
                vout: 0,
                scriptPubKey: '76a9147a642ff1bda1ee266ab5f882dc183b48158178e888ac',
                amount: 0.0000543,
                satoshis: 5430,
                height: 446554
            }]
        }
    },
    utxo_spend: {
        objects: {
            covaltest: [
                {
                    "txid": "ea10a7590ff99a4b84c6e8f3a441dc2651b7d87e11108b56eedf191008ac0993",
                    "address": "1CA9TYBviKnEaF4knshApWCKPKwLpssTZP",
                    "vout": 1,
                    "scriptPubKey": "76a9147a642ff1bda1ee266ab5f882dc183b48158178e888ac",
                    "amount": 0.00295281
                }
            ]
        }
    },
    op_return_data: {
        objects: {
            covalc: "434e545250525459000000000000000001d1d908000016bcc41e9000"
        }
    },
    encrypted_op_return_data: {
        objects: {
            covalc: "a1a79d28163f03217f6d99fef362b2d13e32cbabc7b5f6aaf896d42e"
        }
    }
}