'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

import { SiZendesk, SiGooglesheets, SiTypeform  } from 'react-icons/si'

const integrations = [
    { name: 'ETH', logo: SiZendesk },
    { name: 'Avalanche', logo: SiGooglesheets },
    { name: 'Typeform', logo: SiTypeform },
]

export function Integrations() {
    return (
        <div>
            <h2 className="text-lg font-bold mb-6">Connect with the Protocols of your choice</h2>
            <div className="flex justify-center">
                <Carousel
                    opts={{ align: 'start', loop: true }}
                    plugins={[
                        Autoplay({
                            delay: 1500
                        })
                    ]}
                    className="w-full"
                >
                    <CarouselContent>
                        {integrations.map((int, index) => (
                            <CarouselItem key={index} className="sm:basis-1 md:basis-1/3 space-x-20">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center p-6 h-[150px]">
                                            <int.logo className="text-5xl mb-4" />
                                            <h4 className="text-xl font-semibold text-center">{int.name}</h4>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="flex justify-center mt-6">
                <p className="text-sm text-center">
                    We have integrations with popular lending protocols like AAVE, Compound that you already use.
                    Integrations allow us to directly analyze your Health Factor and provide you with real-time
                    insights to your Liquidity Positions.
                </p>
            </div>
        </div>
    )
}