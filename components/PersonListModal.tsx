// components/PersonListModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Person } from "@/lib/models";
import { getPersonList, deletePersonWithConfirm } from "@/lib/astroweb";
import Iconify from "./Iconify";

interface Props {
  show: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  onEdit: (person: Person) => void;
  onRefresh: () => void;
}

export default function PersonListModal({
  show,
  onClose,
  onSelect,
  onEdit,
  onRefresh,
}: Props) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"private" | "public">("private");

  useEffect(() => {
    if (show) {
      fetchPersons();
    }
  }, [show, viewType]);

  const fetchPersons = async () => {
    setLoading(true);
    const list = await getPersonList(viewType);
    if (list) {
      setPersons(list);
    }
    setLoading(false);
  };

  const handleSelect = (person: Person) => {
    onSelect(person);
    onClose();
  };

  const handleEdit = (person: Person) => {
    onEdit(person);
    onClose();
  };

  const handleDelete = async (person: Person) => {
    const success = await deletePersonWithConfirm(person.PersonId, person.Name);
    if (success) {
      await fetchPersons();
      onRefresh();
    }
  };

  const filteredPersons = persons.filter((p) =>
    p.Name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-lg font-semibold flex items-center">
            <Iconify icon="bi:people" className="mr-2" />
            Person List
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                <Iconify icon="bi:search" />
              </span>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-md border transition-colors flex items-center justify-center ${
                  viewType === "private"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setViewType("private")}
              >
                <Iconify icon="bi:lock" className="mr-1" />
                My Profiles
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded-md border transition-colors flex items-center justify-center ${
                  viewType === "public"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setViewType("public")}
              >
                <Iconify icon="bi:globe" className="mr-1" />
                Public Profiles
              </button>
            </div>
          </div>

          {/* Person List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-3 text-gray-500">Loading persons...</p>
            </div>
          ) : filteredPersons.length === 0 ? (
            <div className="text-center py-12">
              <Iconify
                icon="bi:person-x"
                width={48}
                height={48}
                className="text-gray-400 mx-auto"
              />
              <p className="mt-3 text-gray-500">No persons found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPersons.map((person) => (
                <div
                  key={person.PersonId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleSelect(person)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-semibold">
                        {person.Name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="font-medium text-gray-900">
                          {person.Name}
                        </h6>
                        <small className="text-gray-500">
                          {formatDate(person.BirthTime || "")} •{" "}
                          {person.BirthLocation?.split(",")[0] || "Unknown"}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      title="Select"
                      onClick={() => handleSelect(person)}
                    >
                      <Iconify icon="bi:check-lg" />
                    </button>
                    {viewType === "private" && (
                      <>
                        <button
                          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          title="Edit"
                          onClick={() => handleEdit(person)}
                        >
                          <Iconify icon="bi:pencil" />
                        </button>
                        <button
                          className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                          onClick={() => handleDelete(person)}
                        >
                          <Iconify icon="bi:trash" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-gray-500 text-sm">
            {filteredPersons.length} person(s) found
          </span>
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
