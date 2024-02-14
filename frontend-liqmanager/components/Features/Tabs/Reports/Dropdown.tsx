"use client"
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({
    tokens,
    filterItem,
    setHistoricalData
}: any) => {

    const [currentToken, setCurrentToken] = useState(tokens[0]);

    const handleSelectToken = (token: any) => {
        setCurrentToken(token);
        setHistoricalData([]);
        filterItem(token);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row gap-2 '>
                <Button variant={"outline"} className='gap-4'>
                    <Image src={currentToken.logo} height={20} width={20} alt={currentToken.token} />
                    {currentToken ? currentToken.token : 'Select Token'}
                    <FaChevronDown />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>

                {tokens.map((token : any) => {
                    console.log("TOken", token);
                    return (
                        <DropdownMenuItem onClick={() => handleSelectToken(token)} className='flex flex-row gap-2'>
                            <Image src={token.logo} height={20} width={20} alt={token.token} />
                            {token.token}
                        </DropdownMenuItem>
                    )
                })}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Dropdown;