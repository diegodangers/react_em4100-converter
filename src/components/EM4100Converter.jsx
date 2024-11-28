import React, { useState } from 'react';

const EM4100Converter = () => {
 const [uid, setUid] = useState('');
 const [result, setResult] = useState(null);
 const [error, setError] = useState('');

 const validateUid = (uid) => {
   if (!uid.match(/^\d+$/)) return null;
   const decimal = parseInt(uid, 10);
   if (decimal < 0 || decimal > 0xFFFFFFFF) return null;
   return decimal;
 };

 const decimalToHex = (decimal) => {
   return decimal.toString(16).padStart(8, '0').toLowerCase();
 };

 const nibbleToBinaryWithParity = (nibble) => {
   const binary = parseInt(nibble, 16).toString(2).padStart(4, '0');
   const onesCount = binary.split('1').length - 1;
   const parity = onesCount % 2 === 1 ? '1' : '0';
   return binary + parity;
 };

 const calculateColumnParity = (dataBits) => {
   const rows = [];
   for (let i = 0; i < 50; i += 5) {
     rows.push(dataBits.slice(i, i + 5));
   }
   
   let parity = '';
   for (let col = 0; col < 4; col++) {
     const columnBits = rows.map(row => row[col]).join('');
     const onesCount = columnBits.split('1').length - 1;
     parity += onesCount % 2 === 1 ? '1' : '0';
   }
   return parity;
 };

 const decimalToEm4100 = (decimal) => {
   const hexStr = decimalToHex(decimal);
   let em4100 = '1'.repeat(9);
   let dataBits = '';
   
   dataBits += nibbleToBinaryWithParity('0');
   dataBits += nibbleToBinaryWithParity('0');
   
   for (const nibble of hexStr) {
     dataBits += nibbleToBinaryWithParity(nibble);
   }
   
   const colParity = calculateColumnParity(dataBits);
   return em4100 + dataBits + colParity + '0';
 };

 const formatBinary = (binary) => {
   return binary.match(/.{1,8}/g).join(' ');
 };

 const handleConvert = () => {
   setError('');
   setResult(null);
   
   const decimalUid = validateUid(uid);
   if (decimalUid === null) {
     setError('Invalid UID. Must be decimal number ≤ 4294967295');
     return;
   }
   
   const hexValue = decimalToHex(decimalUid);
   const em4100Binary = decimalToEm4100(decimalUid);
   
   setResult({
     inputUid: uid,
     hexValue,
     em4100: formatBinary(em4100Binary)
   });
 };

 return (
   <div className="container mx-auto p-4 max-w-2xl">
     <h1 className="text-2xl font-bold mb-6 text-center">
       EM4100 Proximity Card UID Converter
     </h1>

     <div className="flex gap-2 mb-4">
       <input
         type="text"
         value={uid}
         onChange={(e) => setUid(e.target.value)}
         placeholder="Enter UID"
         className="flex-1 p-2 border rounded"
       />
       <button
         onClick={handleConvert}
         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
       >
         Convert
       </button>
     </div>

     {error && (
       <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
         {error}
       </div>
     )}

     {result && (
       <div className="p-4 bg-gray-100 rounded">
         <div className="grid gap-4">
           <div>
             <div className="font-semibold">Input UID:</div>
             <div className="font-mono">{result.inputUid}</div>
           </div>
           <div>
             <div className="font-semibold">Hex Value:</div>
             <div className="font-mono">{result.hexValue}</div>
           </div>
           <div>
             <div className="font-semibold">EM4100:</div>
             <div className="font-mono break-all">{result.em4100}</div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default EM4100Converter;