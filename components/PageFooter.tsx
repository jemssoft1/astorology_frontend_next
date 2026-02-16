"use client";

import Iconify from "./Iconify";

export default function PageFooter() {
  return (
    <footer className="flex flex-wrap justify-between items-center py-3 my-4 border-t mt-auto">
      <div className="md:w-1/3 flex items-center">
        <span className="mb-3 md:mb-0 text-gray-500">© 2024 astroweb.in</span>
      </div>

      <ul className="list-none flex md:w-1/3 justify-end">
        <li className="ml-3">
          <a
            className="text-gray-500 hover:text-gray-700"
            href="https://github.com/astroweb/astroweb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Iconify icon="uil:github" width={24} height={24} />
          </a>
        </li>
        <li className="ml-3">
          <a
            className="text-gray-500 hover:text-gray-700"
            href="mailto:contact@astroweb.in"
          >
            <Iconify icon="heroicons-outline:mail" width={24} height={24} />
          </a>
        </li>
      </ul>
    </footer>
  );
}
