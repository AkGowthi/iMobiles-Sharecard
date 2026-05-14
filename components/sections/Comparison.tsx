import { Check, X } from "lucide-react";

export const Comparison = () => {
  return (
    <section id="comparison" className="pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Stack Up</h2>
            <p className="text-gray-600">See why professionals are switching to ShareCard.</p>
         </div>

         <div className="overflow-x-auto border border-gray-200 rounded-3xl">
            <table className="w-full bg-white">
               <thead>
                  <tr className="bg-gray-100/50 border-b border-gray-200">
                    <th className="p-6 text-left text-gray-500 font-medium border-r border-gray-200">Feature</th>
                    <th className="p-6 text-center text-2xl font-bold text-primary-blue bg-blue-50/50 w-1/4 border-r border-gray-200">ShareCard</th>
                    <th className="p-6 text-center text-gray-500 font-medium w-1/4 border-r border-gray-200">Others</th>
                    <th className="p-6 text-center text-gray-500 font-medium w-1/4">Paper Cards</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {[
                    { name: "One-Tap Sharing", us: true, others: true, paper: false },
                    { name: "Update Info Anytime", us: true, others: true, paper: false },
                    { name: "No App Required", us: true, others: false, paper: true },
                    { name: "Custom Full-Color Print", us: true, others: false, paper: true },
                    { name: "Lifetime Validity", us: true, others: false, paper: false },
                    { name: "Analytics Dashboard", us: true, others: true, paper: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 cursor-pointer">
                       <td className="p-6 font-medium text-gray-900 border-r border-gray-200">{row.name}</td>
                       <td className="p-6 text-center bg-blue-50/30 border-r border-gray-200">
                          {row.us ? <Check className="inline text-green-500" /> : <X className="inline text-red-400" />}
                       </td>
                       <td className="p-6 text-center border-r border-gray-200">
                          {row.others ? <Check className="inline text-gray-400" /> : <X className="inline text-gray-300" />}
                       </td>
                       <td className="p-6 text-center">
                          {row.paper ? <Check className="inline text-gray-400" /> : <X className="inline text-gray-300" />}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </section>
  );
};
