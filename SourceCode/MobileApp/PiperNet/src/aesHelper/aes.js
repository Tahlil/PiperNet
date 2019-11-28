const metaData = require('./data/metaAES');

const createStateMatrix = function (hexList) {
  if (hexList.length !== 16) console.error("Input size is wrong");
  let matrix = [
      [],
      [],
      [],
      []
    ],
    indexRow = 0,
    indexColumn = 0;
  for (let index = 0; index < hexList.length; index++) {
    matrix[indexRow][indexColumn] = hexList[index];
    indexColumn++;
    if (indexColumn % 4 === 0) {
      indexRow++;
      indexColumn = 0;
    }
  }
  return matrix;
}

const createByteArray = function (matrix) {
  let byteArray = [],
    byteArrayIndex = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      byteArray[byteArrayIndex] = matrix[i][j];
      byteArrayIndex++;
    }
  }
  return byteArray;
}

const copyColumn = function (mat, pos, col) {
  for (i = 0; i < col.length; i++) {
    mat[i][pos] = col[i];
  }
  return mat;
}

const getColumn = function (matrix, pos) {
  result = [];
  for (i = 0; i < 4; i++)
    result[i] = matrix[i][pos];
  return result;
}

const rotateWord = function (colArray) {
  let result = [];
  for (i = 0; i < colArray.length - 1; i++)
    result[i] = colArray[i + 1];
  result[colArray.length - 1] = colArray[0];
  return result;
}

const subBytesKey = function (colArray) {
  result = [];
  for (i = 0; i < colArray.length; i++) {
    let j = colArray[i];
    result[i] = (metaData.sbox[j & 0x000000FF] & 0xFF);
  }
  return result;
}

const subBytesInput = function (currentState) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let hexaByte = currentState[i][j];
      currentState[i][j] = (metaData.sbox[hexaByte & 0x000000FF] & 0xFF);
    }
  }
  return currentState;
}

const xorBytes = function (bytes1, bytes2) {
  let result = [];
  for (i = 0; i < bytes1.length; i++)
    result[i] = (bytes1[i] ^ bytes2[i]);
  return result;
}

const xorRcon = function (colArray, index) {
  colArray[0] = (colArray[0] ^ (metaData.rcon[0][index] & 0xff));
  return colArray;
}

const generateKeys = function (firstKey) {
  //console.log("First key: ");
  //printHexaDecimalMatrix(firstKey);
  let finalKeys = firstKey;
  let rconIndex = 0;
  for (let i = 4; i < 4 * (metaData.numberOfRound + 1); i++) {
    let col = getColumn(finalKeys, i - 1);
    if (i % 4 === 0) {
      col = rotateWord(col);
      col = subBytesKey(col);
      col = xorBytes(col, getColumn(finalKeys, i - 4));
      col = xorRcon(col, rconIndex);
      rconIndex++;
    } else {
      col = xorBytes(col, getColumn(finalKeys, i - 4));
    }
    //console.log("Iteraion: "+i);
    // printHexaDecimalArray(col);
    //console.log(finalKeys);
    finalKeys = copyColumn(finalKeys, i, col);
    //console.log(finalKeys);
  }
  //printHexaDecimalMatrix(finalKeys);
  return finalKeys;
}

const shiftRows = function (currentState) {
  row = [];
  let shift = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      row[j] = currentState[i][j];
    }
    for (let j = 0; j < 4; j++) {
      currentState[i][j] = row[(j + shift) % 4];
    }
    shift++;
  }
  return currentState;
}

const multiply = function (constant, b) {
  let inda = (constant < 0) ? (constant + 256) : constant;
  let indb = (b < 0) ? (b + 256) : b;
  if (constant != 0 && b != 0) {
    let index = (metaData.logTable[inda] + metaData.logTable[indb]);
    let val = (metaData.inverseLogTable[index % 255]);
    return val;
  } else
    return 0;
}

const mixColumn = function (colNum, currentState) {
  colCopy = [];
  for (let i = 0; i < 4; i++)
    colCopy[i] = currentState[i][colNum];
  currentState[0][colNum] = (multiply(2, colCopy[0]) ^ colCopy[2] ^ colCopy[3] ^ multiply(3, colCopy[1]));
  currentState[1][colNum] = (multiply(2, colCopy[1]) ^ colCopy[3] ^ colCopy[0] ^ multiply(3, colCopy[2]));
  currentState[2][colNum] = (multiply(2, colCopy[2]) ^ colCopy[0] ^ colCopy[1] ^ multiply(3, colCopy[3]));
  currentState[3][colNum] = (multiply(2, colCopy[3]) ^ colCopy[1] ^ colCopy[2] ^ multiply(3, colCopy[0]));
  return currentState;
}

mixColumns = function (currentState) {
  for (let i = 0; i < 4; i++)
    currentState = mixColumn(i, currentState);
  return currentState;
}

const printHexaDecimalArray = function (hexArray) {
  for (let j = 0; j < hexArray.length; j++) {
    process.stdout.write(hexArray[j].toString(16) + " ");
  }
  console.log("");
}

const printHexaDecimalMatrix = function (hexMatrix) {
  for (let i = 0; i < hexMatrix.length; i++) {
    printHexaDecimalArray(hexMatrix[i]);
  }
}

addRoundKey = function (currentRound, currentState, keys) {
  let col, j = 0;
  for (let i = 0; i < 4; i++) {
    col = xorBytes(getColumn(currentState, i), getColumn(keys, currentRound * 4 + j));
    copyColumn(currentState, i, col);
    j++;
  }
  return currentState;
}

const subBytesInverse = function (currentState) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let b = currentState[i][j];
      currentState[i][j] = (metaData.inverseSbox[b & 0x000000FF] & 0xFF);
    }
  }
  return currentState;
}

const shiftRowsInverse = function (currentState) {
  let row = [],
    shift = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      row[(j + shift) % 4] = currentState[i][j];
    }
    for (let j = 0; j < 4; j++) {
      currentState[i][j] = row[j];
    }
    shift++;
  }
  return currentState;
}

const mixColumnInverse = function (colNum, currentState) {
  let copyColumn = [];
  for (let i = 0; i < 4; i++)
    copyColumn[i] = currentState[i][colNum];
  currentState[0][colNum] = (multiply(0xE, copyColumn[0]) ^ multiply(0xB, copyColumn[1]) ^ multiply(0xD, copyColumn[2]) ^ multiply(0x9, copyColumn[3]));
  currentState[1][colNum] = (multiply(0xE, copyColumn[1]) ^ multiply(0xB, copyColumn[2]) ^ multiply(0xD, copyColumn[3]) ^ multiply(0x9, copyColumn[0]));
  currentState[2][colNum] = (multiply(0xE, copyColumn[2]) ^ multiply(0xB, copyColumn[3]) ^ multiply(0xD, copyColumn[0]) ^ multiply(0x9, copyColumn[1]));
  currentState[3][colNum] = (multiply(0xE, copyColumn[3]) ^ multiply(0xB, copyColumn[0]) ^ multiply(0xD, copyColumn[1]) ^ multiply(0x9, copyColumn[2]));
  return currentState;
}

const mixColumnsInverse = function (currentState) {
  for (let i = 0; i < 4; i++)
    currentState = mixColumnInverse(i, currentState);
  return currentState;
}

const encrypt16BytesBlock = function (currentState, currentRound, keys) {
  currentState = subBytesInput(currentState);
  currentState = shiftRows(currentState);
  if (currentRound != metaData.numberOfRound)
    currentState = mixColumns(currentState);
  currentState = addRoundKey(currentRound, currentState, keys)
  //printHexaDecimalMatrix(currentState)
  return currentState;
}

const decrypt16BytesBlock = function (currentState, currentRound, keys) {
  currentState = subBytesInverse(currentState);
  currentState = shiftRowsInverse(currentState);
  currentState = addRoundKey(currentRound, currentState, keys)
  if (currentRound != 0)
    currentState = mixColumnsInverse(currentState);
  //printHexaDecimalMatrix(currentState)
  return currentState;
}

const encryptBlock = function (plainHexBlock, keys) {
  let currentState = plainHexBlock;
  currentState = addRoundKey(0, currentState, keys);
  //console.log("After round 0:");
  //printHexaDecimalMatrix(currentState);
  for (let index = 1; index <= metaData.numberOfRound; index++) {
    currentState = encrypt16BytesBlock(currentState, index, keys);
  }
  //console.log("Encrypted: ");
  //printHexaDecimalMatrix(currentState);
  return currentState;
}

const decryptBlock = function (encryptedHexBlock, keys) {
  let currentState = encryptedHexBlock;
  currentState = addRoundKey(metaData.numberOfRound, currentState, keys);
  for (let i = metaData.numberOfRound - 1; i > -1; i--) {
    currentState = decrypt16BytesBlock(currentState, i, keys);
  }
  //console.log("Encrypted: ");
  //printHexaDecimalMatrix(currentState);
  return currentState;
}

var keyHexList = [0x54, 0x73, 0x20, 0x67, 0x68, 0x20, 0x4B, 0x20, 0x61, 0x6D, 0x75, 0x46, 0x74, 0x79, 0x6E, 0x75];
const getKeyMatrix = function () {

  return createStateMatrix(keyHexList);
}

// const plainHexList = [0x54, 0x4F, 0x4E, 0x20, 0x77, 0x6E, 0x69, 0x54, 0x6F, 0x65, 0x6E, 0x77, 0x20, 0x20, 0x65, 0x6F];
// console.log("Test input:");
// printHexaDecimalArray(plainHexList);
// //console.log("Test key:");
// //printHexaDecimalArray(keyHexList);

function ascii_to_hexa(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1;
}

function validKey(key){
  return key.length === 16;
}

var encryptPaddedByBlocks = function (paddedBytes) {
  var inputKey = $('#keyenc').val();
  if(inputKey !== ""){
    inputKey = ascii_to_hexa(inputKey);
    if(validKey(inputKey)){
      keyHexList = inputKey;
    }
    else{
      alert("Not a valid. key using the default key.");
    }
  }
  var matrixKey = getKeyMatrix(keyHexList);
  var keys = generateKeys(matrixKey);
  let tempBlock = [],
    encryptedBlock = [];
  for (let index = 0; index < paddedBytes.length; index++) {
    var byte = paddedBytes[index];
    tempBlock.push(byte);
    if (tempBlock.length === 16) {
      var matrixInput = createStateMatrix(tempBlock);
      var encryptedMatrix = encryptBlock(matrixInput, keys);
      var finalEncryptedArray = createByteArray(encryptedMatrix);
      encryptedBlock = [...encryptedBlock, ...finalEncryptedArray]
      tempBlock = [];
    }
  }
  return encryptedBlock;
}

var decryptPaddedByBlocks = function (paddedBytes) {
  var inputKey = $('#keydec').val();
  if(inputKey !== ""){
    inputKey = ascii_to_hexa(inputKey);
    if(validKey(inputKey)){
      keyHexList = inputKey;
    }
    else{
      alert("Not a valid. key using the default key.");
    }
  }
  var matrixKey = getKeyMatrix(keyHexList);
  var keys = generateKeys(matrixKey);
  let tempBlock = [],
    decryptedBlock = [];
  for (let index = 0; index < paddedBytes.length; index++) {
    var byte = paddedBytes[index];
    tempBlock.push(byte);
    if (tempBlock.length === 16) {
      var encryptedMatrix = createStateMatrix(tempBlock);
      var decryptedMatrix = decryptBlock(encryptedMatrix, keys);
      var finalDecryptedArray = createByteArray(decryptedMatrix);
      decryptedBlock = [...decryptedBlock, ...finalDecryptedArray]
      tempBlock = [];
    }
  }
  return decryptedBlock;
}
// let matrixInput = createStateMatrix(plainHexList);

// //console.log("Test 1st key:");
// //printHexaDecimalMatrix(matrixKey);

// console.log("Test input:");
// printHexaDecimalMatrix(matrixInput);
// keys = generateKeys(matrixKey);
// encryptedMatrix = encryptBlock(matrixInput, keys);

// console.log("Encrypted: ");
// printHexaDecimalMatrix(encryptedMatrix);

// let finalEncryptedArray = createByteArray(encryptedMatrix);
// let decryptedMatrix = decryptBlock(encryptedMatrix, keys);
// console.log("Decrypted");
//printHexaDecimalMatrix(decryptedMatrix);

//matrixKey = copyColumn(matrixKey, 4, [1,2,3,4])
//console.log(matrixKey);