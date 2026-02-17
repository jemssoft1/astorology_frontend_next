"use client";

import { APIMethod } from "@/types/api-docs";
import { useState } from "react";
import Iconify from "./Iconify";

interface Props {
  method: APIMethod;
}

export default function APIMethodViewer({ method }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCurlExample = () => {
    const baseUrl = process.env.NEXT_PUBLIC_NEXT_JS_API_URL;
    const body = method.requestExample || {};
    return `curl -X ${method.method} "${baseUrl}${method.endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`;
  };

  return (
    <div className="card shadow-sm mb-4 overflow-hidden border-0 bg-white ">
      <div className="card-header flex justify-between items-center py-3 px-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              method.method === "POST"
                ? "bg-blue-100 text-blue-700"
                : method.method === "GET"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
            }`}
          >
            {method.method}
          </span>
          <h3 className="text-lg font-semibold text-slate-800  m-0">
            {method.title}
          </h3>
        </div>
        <div className="text-sm font-mono text-slate-500 px-3 py-1 rounded">
          {method.endpoint}
        </div>
      </div>

      <div className="card-body p-4">
        <p className="text-slate-600 mb-4">{method.description}</p>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            Parameters
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="py-2 px-1 text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="py-2 px-1 text-sm font-semibold text-slate-700">
                    Type
                  </th>
                  <th className="py-2 px-1 text-sm font-semibold text-slate-700 text-center">
                    Required
                  </th>
                  <th className="py-2 px-1 text-sm font-semibold text-slate-700">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {method.parameters.map((param) => (
                  <tr key={param.name}>
                    <td className="py-3 px-1 text-sm font-mono text-blue-600 font-bold">
                      {param.name}
                    </td>
                    <td className="py-3 px-1 text-xs text-slate-500 font-mono italic">
                      {param.type}
                    </td>
                    <td className="py-3 px-1 text-sm text-center">
                      {param.required ? (
                        <span className="text-red-500">Yes</span>
                      ) : (
                        <span className="text-slate-400 font-light">No</span>
                      )}
                    </td>
                    <td className="py-3 px-1 text-sm text-slate-600">
                      {param.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                cURL Example
              </h4>
              <button
                onClick={() => copyToClipboard(getCurlExample())}
                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-all font-medium"
              >
                <Iconify
                  icon={copied ? "mdi:check" : "mdi:content-copy"}
                  className="w-3.5 h-3.5"
                />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto border border-slate-800">
              <code>{getCurlExample()}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sample Response
            </h4>
            <div className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto border border-slate-800 h-[200px] scrollbar-thin scrollbar-thumb-slate-700">
              <pre>
                <code>
                  {JSON.stringify(method.responseExamples[0].payload, null, 2)}
                </code>
              </pre>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic">
              * Showing: {method.responseExamples[0].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
