import React from 'react';
import { CTNativeLoader } from './ScreenLoader';

export default function LoadingDialog({ isVisible }) {
    return <CTNativeLoader visible={isVisible} />;
}
