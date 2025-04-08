import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
    height: '400px',
    width: '100%',
    objectFit: 'cover',
};

const Advertisement = () => (
    <Carousel arrows infinite autoplay>
        <div>
            <img src="/ads/ads1.jpg" alt="广告1" style={contentStyle} />
        </div>
        <div>
            <img src="/ads/ads2.png" alt="广告2" style={contentStyle} />
        </div>
    </Carousel>
);

export default Advertisement;
