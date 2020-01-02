### XCP Asset ToDo

#### Transaction

- ~~Get XCP Asset Details~~

- ~~Create XCP Transaction~~

- ~~Encode Transaction details into opreturn~~

- ~~Sign Transaction (Server)~~

- ~~Sign Transaction (Browser)~~

#### Wallet Management

- Create Key/Address per user

### TESTS
- ✓ gets asset info from API (426ms)
- ✓ gets asset info object (206ms)
- ✓ returns unchanged dividible asset total (174ms)
- ✓ returns converted individible asset total (168ms)
- ✓ gets utxo from api (308ms)
- ✓ gets sorted utxo from api (61ms)
- ✓ calculates total utxo needed with no remaining or amount
- ✓ calculates total utxo when provided remaining & amount
- ✓ calculates total utxo when provided remaining & amount
- ✓ calculates total utxo when provided remaining & amount
- ✓ generates spendable utxo list
- ✓ generates transaction from utxo list
- ✓ encodes asset and amount
- ✓ creates valid script
- ✓ rc4 encrypts payload
- ✓ encodes XCP asset ID
- ✓ encodes COVALC asset ID
- ✓ pads COVALC encoded asset ID
- ✓ satoshi rounds
- ✓ satoshi rounds decimals
- ✓ hexifies rounded amount
- ✓ generates transaction from address
- ✓ generates complete transaction when provided to, from, asset, amount
- ✓ signs transaction (281ms)
- ✓ pushes transaction
