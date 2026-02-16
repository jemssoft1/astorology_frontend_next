"use client";

import { useState, useEffect, useRef } from "react";
import { Person } from "@/lib/models";
import { getPersonList, deletePersonWithConfirm } from "@/lib/astroweb";
import Iconify from "./Iconify";
import AddPersonModal from "./AddPersonModal";
import EditPersonModal from "./EditPersonModal";
import PersonListModal from "./PersonListModal";

interface Props {
  onPersonSelected: (person: Person) => void;
  label?: string;
  defaultPersonId?: string;
}

export default function PersonSelector({
  onPersonSelected,
  label = "Select Person",
  defaultPersonId,
}: Props) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchPersons = async () => {
    setLoading(true);
    const list = await getPersonList("private");
    if (list) {
      setPersons(list);

      // Check for persisted selection first
      const savedPersonId = localStorage.getItem("global_selected_person_id");
      let personToSelect = null;

      if (savedPersonId) {
        personToSelect = list.find((p) => p.PersonId === savedPersonId);
      }

      // Fallback to defaultPersonId if no saved selection or saved person not found
      if (!personToSelect && defaultPersonId) {
        personToSelect = list.find((p) => p.PersonId === defaultPersonId);
      }

      if (personToSelect) {
        setSelectedPerson(personToSelect);
        onPersonSelected(personToSelect);
      } else if (savedPersonId) {
        // Clean up invalid saved ID
        localStorage.removeItem("global_selected_person_id");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePersonSelect = (personId: string) => {
    const selected = persons.find((p) => p.PersonId === personId);
    if (selected) {
      setSelectedPerson(selected);
      onPersonSelected(selected);
      localStorage.setItem("global_selected_person_id", selected.PersonId);
    }
  };

  const handleAddPerson = () => {
    setShowAddModal(true);
    setDropdownOpen(false);
  };

  const handleEditPerson = () => {
    if (selectedPerson) {
      setEditingPerson(selectedPerson);
      setShowEditModal(true);
      setDropdownOpen(false);
    }
  };

  const handlePersonList = () => {
    setShowListModal(true);
    setDropdownOpen(false);
  };

  const handleFixBirthTime = () => {
    if (selectedPerson) {
      window.open(
        `/tools/birth-time-rectification?personId=${selectedPerson.PersonId}`,
        "_blank",
      );
      setDropdownOpen(false);
    }
  };

  const handleDeletePerson = async () => {
    if (!selectedPerson) return;

    const success = await deletePersonWithConfirm(
      selectedPerson.PersonId,
      selectedPerson.Name,
    );

    if (success) {
      // Clear saved selection if we deleted the selected person
      if (
        localStorage.getItem("global_selected_person_id") ===
        selectedPerson.PersonId
      ) {
        localStorage.removeItem("global_selected_person_id");
      }
      setSelectedPerson(null);
      await fetchPersons();
    }
    setDropdownOpen(false);
  };

  const handleAddSuccess = () => {
    fetchPersons();
  };

  const handleEditSuccess = () => {
    fetchPersons();
  };

  const handleSelectFromList = (person: Person) => {
    setSelectedPerson(person);
    onPersonSelected(person);
    localStorage.setItem("global_selected_person_id", person.PersonId);
  };

  const handleEditFromList = (person: Person) => {
    setEditingPerson(person);
    setShowEditModal(true);
  };

  return (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex">
          <select
            className="flex-1 px-3 rounded-md py-2 border border-[#0b5ed7] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            value={selectedPerson?.PersonId || ""}
            onChange={(e) => handlePersonSelect(e.target.value)}
            disabled={loading}
          >
            <option value="" className="text-black">
              {loading ? "Loading..." : "Select a person..."}
            </option>
            {persons.map((p) => (
              <option
                key={p.PersonId}
                value={p.PersonId}
                className="text-black"
              >
                {p.Name} - {new Date(p.BirthTime || "").getFullYear() || "N/A"}
              </option>
            ))}
          </select>

          {/* Dropdown Button */}
          <div className="relative ms-2" ref={dropdownRef}>
            <button
              className=" px-3 py-3 inline-flex items-center justify-center bg-[#0b5ed7] text-white rounded-md"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <Iconify icon="bi:person-plus" width={18} height={18} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    onClick={handleAddPerson}
                  >
                    <Iconify
                      icon="bi:person-plus"
                      width={18}
                      height={18}
                      className="text-green-600"
                    />
                    <span className="text-gray-700">Add New Person</span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={handleEditPerson}
                    disabled={!selectedPerson}
                  >
                    <Iconify
                      icon="bi:pencil"
                      width={18}
                      height={18}
                      className="text-blue-600"
                    />
                    <span className="text-gray-700">
                      Edit Person
                      {!selectedPerson && (
                        <small className="text-gray-400 ml-2">
                          (Select first)
                        </small>
                      )}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left transition-colors"
                    onClick={handlePersonList}
                  >
                    <Iconify
                      icon="bi:list-ul"
                      width={18}
                      height={18}
                      className="text-cyan-600"
                    />
                    <span className="text-gray-700">View All Persons</span>
                  </button>
                </li>
                <li>
                  <hr className="my-1 border-t border-gray-200" />
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={handleFixBirthTime}
                    disabled={!selectedPerson}
                  >
                    <Iconify
                      icon="bi:clock-history"
                      width={18}
                      height={18}
                      className="text-yellow-600"
                    />
                    <span className="text-gray-700">
                      Fix Birth Time
                      {!selectedPerson && (
                        <small className="text-gray-400 ml-2">
                          (Select first)
                        </small>
                      )}
                    </span>
                  </button>
                </li>
                <li>
                  <hr className="my-1 border-t border-gray-200" />
                </li>
                <li>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-left text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={handleDeletePerson}
                    disabled={!selectedPerson}
                  >
                    <Iconify icon="bi:trash" width={18} height={18} />
                    <span>
                      Delete Person
                      {!selectedPerson && (
                        <small className="text-gray-400 ml-2">
                          (Select first)
                        </small>
                      )}
                    </span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Selected Person Info */}
        {selectedPerson && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                {selectedPerson.Name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">
                  {selectedPerson.Name}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(
                    selectedPerson.BirthTime || "",
                  ).toLocaleDateString()}{" "}
                  •{" "}
                  {selectedPerson?.BirthLocation?.split(",")[0] ||
                    "Unknown Location"}
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded flex-shrink-0 ${
                  selectedPerson.Gender === "Male"
                    ? "bg-blue-600 text-white"
                    : selectedPerson.Gender === "Female"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-600 text-white"
                }`}
              >
                {selectedPerson.Gender}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPersonModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <EditPersonModal
        show={showEditModal}
        person={editingPerson}
        onClose={() => {
          setShowEditModal(false);
          setEditingPerson(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <PersonListModal
        show={showListModal}
        onClose={() => setShowListModal(false)}
        onSelect={handleSelectFromList}
        onEdit={handleEditFromList}
        onRefresh={fetchPersons}
      />
    </>
  );
}
