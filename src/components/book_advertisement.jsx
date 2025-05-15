import React, { useEffect, useState } from 'react';
import { Carousel, Spin, message } from 'antd';
import { fetchAdvertisement } from '../service/advertisement'; // 路径按需调整

const contentStyle = {
    height: '400px',
    width: '100%',
    objectFit: 'cover',
};

const Advertisement = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAds = async () => {
            try {
                const data = await fetchAdvertisement();
                setAds(data);
            } catch (err) {
                message.error(err.message || "广告加载失败");
            } finally {
                setLoading(false);
            }
        };
        loadAds();
    }, []);

    if (loading) return <Spin />;

    if (ads.length === 0) return <div style={{ textAlign: 'center' }}>暂无广告</div>;

    return (
        <Carousel arrows infinite autoplay>
            {ads.map((ad) => (
                <div key={ad.id}>
                    <img src={ad.url} alt={`广告-${ad.id}`} style={contentStyle} />
                </div>
            ))}
        </Carousel>
    );
};

export default Advertisement;
