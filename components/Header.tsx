"use client";

import React from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";

const Header = () => {
    return (
        <header>
            <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Trello-logo-blue.svg/2560px-Trello-logo-blue.svg.png"
                    alt="Trello logo"
                    width={300}
                    height={100}
                    className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
                />

                <div className="flex items-center space-x-5 justify-end w-full">
                    {/* Search box */}
                    <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Seacrh"
                            className="flex-1 outline-none p-2"
                        />
                        <button type="submit" hidden>
                            Search
                        </button>
                    </form>
                    {/* Avatar */}
                    <Avatar
                        name="Alexey Koldaev"
                        round
                        color="blue"
                        size="50"
                    />
                </div>
            </div>
            <div className="flex items-center justify-center px-5 py-2 md:py-5">
                <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-blue-500">
                    <UserCircleIcon className="inline-block h-10 w-10 text-blue-600 mr-1" />
                    GPT is summarising your tasks for the day...
                </p>
            </div>
        </header>
    );
};

export default Header;
