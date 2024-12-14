import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <h2 className="text-xl flex items-center gap-2">
          <span className="text-green-400">&gt;</span> {title}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-green-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-green-400" />
        )}
      </button>

      {isOpen && <div className="border-t border-green-500/30">{children}</div>}
    </div>
  );
}

export default Accordion;
