// import React, { useState, useEffect } from 'react';
// import Input from '../../components/Input';
// import Button from '../../components/Button';
// import { showToast } from '../../components/ToastNotifier';
// import { 
//   createContract,
//   checkContractExists 
// } from '../../services/contract/contractService';
// import { getCompanies } from '../../services/company/companyService';
// import { getScreens } from '../../services/screen/screenService';

// const ContractForm = () => {
//   const [form, setForm] = useState({
//     info: '',
//     startContractAt: '',
//     expiredAt: '',
//     companyId: '',
//     screenId: '',
//     supplyType: 'CELEBRITY_SYSTEMS',
//     operatorType: 'OWNER',
//     accountName: '',
//     durationType: 'MONTHLY',
//     contractValue: ''
//   });
  
//   const [companies, setCompanies] = useState([]);
//   const [screens, setScreens] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [companiesData, screensData] = await Promise.all([
//           getCompanies(),
//           getScreens({ page: 0 })
//         ]);
//         setCompanies(companiesData);
//         setScreens(screensData.content);
//         setFetching(false);
//       } catch (error) {
//         showToast('Failed to load initial data', 'error');
//         setFetching(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Check if contract already exists
//       const exists = await checkContractExists(form.companyId, form.screenId);
//       if (exists) {
//         showToast('A contract already exists for this company and screen', 'warning');
//         return;
//       }

//       // Prepare contract data
//       const contractData = {
//         ...form,
//         contractValue: parseFloat(form.contractValue),
//         startContractAt: form.startContractAt ? `${form.startContractAt}T00:00:00` : null,
//         expiredAt: form.expiredAt ? `${form.expiredAt}T23:59:59` : null
//       };

//       await createContract(contractData);
//       showToast('Contract created successfully!');
//       // Reset form after successful submission
//       setForm({
//         info: '',
//         startContractAt: '',
//         expiredAt: '',
//         companyId: '',
//         screenId: '',
//         supplyType: 'CELEBRITY_SYSTEMS',
//         operatorType: 'OWNER',
//         accountName: '',
//         durationType: 'MONTHLY',
//         contractValue: ''
//       });
//     } catch (error) {
//       showToast(error.response?.data?.message || 'Failed to create contract', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) return <div className="text-center py-8">Loading initial data...</div>;

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Contract</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
//         <Input 
//           label="Contract Information" 
//           id="info" 
//           name="info" 
//           value={form.info} 
//           onChange={handleChange} 
//           required 
//           placeholder="Enter contract details"
//         />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Input
//             label="Start Date"
//             id="startContractAt"
//             name="startContractAt"
//             type="date"
//             value={form.startContractAt}
//             onChange={handleChange}
//             required
//           />
//           <Input
//             label="Expiry Date"
//             id="expiredAt"
//             name="expiredAt"
//             type="date"
//             value={form.expiredAt}
//             onChange={handleChange}
//             required
//           />
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               name="companyId"
//               value={form.companyId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a company</option>
//               {companies.map(company => (
//                 <option key={company.id} value={company.id}>
//                   {company.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Screen</label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               name="screenId"
//               value={form.screenId}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a screen</option>
//               {screens.map(screen => (
//                 <option key={screen.id} value={screen.id}>
//                   {screen.name} ({screen.location})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Supply Type</label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               name="supplyType"
//               value={form.supplyType}
//               onChange={handleChange}
//               required
//             >
//               <option value="CELEBRITY_SYSTEMS">Celebrity Systems</option>
//               <option value="THIRD_PARTY">Third Party</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Operator Type</label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               name="operatorType"
//               value={form.operatorType}
//               onChange={handleChange}
//               required
//             >
//               <option value="OWNER">Owner</option>
//               <option value="RENTAL">Rental</option>
//             </select>
//           </div>
//         </div>
        
//         <Input
//           label="Account Name"
//           id="accountName"
//           name="accountName"
//           value={form.accountName}
//           onChange={handleChange}
//           required
//           placeholder="Enter account name"
//         />
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Duration Type</label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               name="durationType"
//               value={form.durationType}
//               onChange={handleChange}
//               required
//             >
//               <option value="MONTHLY">Monthly</option>
//               <option value="QUARTERLY">Quarterly</option>
//               <option value="YEARLY">Yearly</option>
//             </select>
//           </div>
//           <Input
//             label="Contract Value ($)"
//             id="contractValue"
//             name="contractValue"
//             type="number"
//             step="0.01"
//             min="0"
//             value={form.contractValue}
//             onChange={handleChange}
//             required
//             placeholder="0.00"
//           />
//         </div>
        
//         <div className="pt-4">
//           <Button 
//             isLoading={loading} 
//             type="submit"
//             className="w-full md:w-auto"
//           >
//             Create Contract
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ContractForm;