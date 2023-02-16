const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
//https://iancoleman.io/bip39/    : to check the account detail using mnemonics

const main = async function (){
    const mnemonic = bip39.generateMnemonic(); //generates string
    console.log(mnemonic)
    const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    //generating public address one
    const addrNode1 = root.derive("m/44'/60'/0'/0/0"); //line 1
    const pubKey1 = ethUtil.privateToPublic(addrNode1._privateKey);
    const addr1 = ethUtil.publicToAddress(pubKey1).toString('hex');
    const address1 = ethUtil.toChecksumAddress('0x'+addr1);
    console.log(address1);
    //generating public address two
    const addrNode2 = root.derive("m/44'/60'/0'/0/1");
    const pubKey2 = ethUtil.privateToPublic(addrNode2._privateKey);
    const addr2 = ethUtil.publicToAddress(pubKey2).toString('hex');
    const address2 = ethUtil.toChecksumAddress('0x'+addr2);
    console.log(address2);

    //mnemonics : lamp trash model crack welcome try theme recipe drift wide before denial
    //public key : 0x094d571069DA1E782721b5aC1ac733Ed720bF3aE
    //public key : 0x837409686C75B79d6D3d0a8E2a250647d15C96E1
}

main();