import { BorrowAssetToken, SupplyAssetToken } from '@/config/asset';
import Image from 'next/image';
import React from 'react';

const AssetDetails = ({
    reserve
}: any) => {
    console.log("Reserve", reserve);

    const asset = BorrowAssetToken.find((asset) => {
        console.log("Assettttttt", asset.contractAddress.toLowerCase(), reserve.underlyingAsset.toLowerCase(), typeof (asset.contractAddress), typeof (reserve.underlyingAsset), asset.contractAddress.toLowerCase() == reserve.underlyingAsset.toLowerCase())
        if (asset.contractAddress.toLowerCase() === reserve.underlyingAsset.toLowerCase()) {
            return asset
        }
    });

    console.log("Asset Image", asset);

    return (
        <div className='flex gap-4 items-center justify-between'>
            <div className='flex gap-2'>
                {asset && <Image src={asset.logo} alt={asset.name} width={30} height={30} />}
                <div className='text-xl font-[500]'>{reserve.reserve.name}</div>
            </div>

            <div className='flex flex-col'>
                <div className='text-sm font-[300] text-gray-600'>APY</div>
                <div>{(parseFloat(reserve.reserve.variableBorrowAPY) * 100).toFixed(2)}%</div>
            </div>

            <div className='flex flex-col'>
                <div>{parseFloat(reserve.totalBorrowsMarketReferenceCurrency).toFixed(2)}</div>
                <div>${parseFloat(reserve.totalBorrowsUSD).toFixed(2)}</div>
            </div>

        </div>
    );
};

export default AssetDetails;