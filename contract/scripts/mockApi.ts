// Define the array of uint256 values to be returned
let uint256Array = [1000, 2000, 3000, 4000, 1];

// Function to encode a uint256 value to a 32-byte Uint8Array
function encodeUint256(value: any) {
  let buffer = new Uint8Array(32); // Allocate a 32-byte buffer
  let valueBigInt = BigInt(value);

  // Write the value as a big-endian 256-bit integer
  for (let i = 31; i >= 0; i--) {
    buffer[i] = Number(valueBigInt & BigInt(0xff));
    valueBigInt >>= BigInt(8);
  }
  return buffer;
}

export const getInfluencerShareBytes = () => {
  // Allocate a buffer large enough to hold all the elements (each uint256 is 32 bytes)
  let bufferLength = uint256Array.length * 32;
  let buffer = new Uint8Array(bufferLength);

  // Write each encoded element into the buffer at the correct offset
  for (let i = 0; i < uint256Array.length; i++) {
    let encodedElement = encodeUint256(uint256Array[i]);
    buffer.set(encodedElement, i * 32);
  }

  // Return the encoded array as the function result
  return buffer;
};
