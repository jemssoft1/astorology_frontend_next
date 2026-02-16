"use client";

import { useState, useEffect } from "react";
import { Person } from "@/lib/models";
import { astroweb } from "@/lib/astroweb";
import Iconify from "./Iconify";
import Link from "next/link";

export default function PersonList() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersons() {
      setLoading(true);
      const list = await astroweb.FetchPersonListFromAPI("private");
      if (list) {
        setPersons(list);
      }
      setLoading(false);
    }
    fetchPersons();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="alert alert-info">
        No persons found. Please add a person.
      </div>
    );
  }

  return (
    <div className="list-group">
      {persons.map((p) => (
        <div
          key={p.PersonId}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <h5 className="mb-1">{p.Name}</h5>
            <small className="text-muted">
              {p.Gender} - {p.BirthTime}
            </small>
          </div>
          <div>
            <Link
              href={`/edit-person?SelectedPersonStorageKey=${p.PersonId}`}
              className="btn btn-outline-primary btn-sm me-2"
            >
              <Iconify icon="mdi:pencil" /> Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
