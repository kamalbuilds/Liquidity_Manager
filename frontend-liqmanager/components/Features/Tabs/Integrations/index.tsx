import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const integrations = [
    { name: 'ETH',logo: 'https://static.particle.network/token-list/ethereum/native.png', type: 'image' },
    { name: 'Avalanche', logo: 'https://static.particle.network/token-list/avalanche/native.png', type: 'image' },
    { name: 'Mumbai',  logo: 'https://static.particle.network/token-list/polygon/native.png', type: 'image' },
    { name: 'AAVE' , logo : 'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png' , type : 'image' },
    { name: 'Compound' , logo : 'https://d392zik6ho62y0.cloudfront.net/images/compound-logo.png' , type : 'image' }
];

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
                                            {int.type === 'component' ? (
                                                // @ts-expect-error
                                                <int.logo className="text-5xl mb-4" />
                                            ) : (
                                                // @ts-ignore
                                                <img src={int.logo} alt={int.name} className="h-20 mb-4" />
                                            )}
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
    );
}
