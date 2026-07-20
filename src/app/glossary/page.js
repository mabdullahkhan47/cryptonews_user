"use client"
import Header from '@/components/Header'
import Home from '@/components/Home'
import React, { useEffect, useMemo, useState } from 'react'
import { Loader2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

const Page = () => {

  const [glossaryData, setglossaryData] = useState([]);
  const { searchQuery } = useSearch();

  const getGlossary = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/glossary`, {
        method: "GET"
      });
      const data = await response.json();
      setglossaryData(data.glossary);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getGlossary();
  }, [glossaryData]);

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    let list = glossaryData;
    if (q) {
      list = list.filter((a) => {
        const termMatch = a.term?.toLowerCase().includes(q);
        const definitionMatch = a.definition?.toLowerCase().includes(q);
        return termMatch || definitionMatch;
      });
    }
    return list;
  }, [searchQuery, glossaryData]);

  if (!glossaryData || glossaryData.length === 0) {
    return (
      <div className="flex justify-center pt-20 p-6">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className='bg-whiite dark:bg-zinc-900 min-h-screen'>
      <Header />
      <Home filtered={filtered} />
    </div>
  )
}

export default Page