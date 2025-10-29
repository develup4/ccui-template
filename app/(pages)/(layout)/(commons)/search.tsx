"use client";

interface LeftListSearchProps {
  setSearchKeyword: Function;
}

export default function LeftListSearch({
  setSearchKeyword,
}: LeftListSearchProps) {
  return (
    <div className="mb-4">
      <label className="input bg-background border-bd focus-within:border-white focus-within:outline-none shadow-none">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          className="grow w-full"
          placeholder="Search"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <kbd className="kbd kbd-sm bg-background">⌘</kbd>
      </label>
    </div>
  );
}
