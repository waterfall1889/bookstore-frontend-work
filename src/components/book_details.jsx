import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Row, Col, Typography, Rate, Divider, Button, Space, InputNumber} from 'antd';

const {Title, Text, Paragraph} = Typography;

const bookList = [
    {
        bookname: "挪威的森林",
        author: "村上春树",
        price: "40",
        rate: 4.5,
        bookpicture: '/bookcovers/book1.jpg',
        id: 1,
        remains: 12,
        description: "《挪威的森林》是日本作家村上春树所著的一部长篇爱情小说，" +
            "影响了几代读者的青春名作。故事讲述主角渡边纠缠在情绪不稳定且患有精神疾病的直子和开朗活泼的小林绿子之间，" +
            "苦闷彷徨，最终展开了自我救赎和成长的旅程。" +
            "彻头彻尾的现实笔法，描绘了逝去的青春风景，小说中弥散着特有的感伤和孤独气氛。" +
            "自1987年在日本问世后，该小说在年轻人中引起共鸣，风靡不息。" +
            "上海译文出版社于2018年2月，推出该书的全新纪念版。"
    },
    {
        bookname: "没有英雄的叙事诗",
        author: "安娜·阿赫玛托娃",
        price: "68",
        rate: 4.0,
        bookpicture: '/bookcovers/book2.jpg',
        id: 2,
        remains: 32,
        description: "本书收入阿赫玛托娃一生不同创作阶段近二百首（组）代表性作品及诗歌片断。" +
            "既有《在深色的面纱下她绞着双手》等早期名作，又有组诗《安魂曲》这样的纪念碑式力作。" +
            "《安魂曲》通过个人苦难折射民族的灾难和不幸，在控诉时代残暴的同时，歌颂了受难者的崇高和尊严。" +
            "它的创作，把阿赫玛托娃推向了一个伟大的悲剧女诗人的境界。" +
            "在此之前，诗人的作品以优美精致、简约克制著称，随后融入了坚韧、沉着，带着历史赋予的全部重量；" +
            "后期作品保持了细部的可感性，更深层次地呈现出肃穆、庄重的风格。诗人后期的长诗《没有英雄的叙事诗》，" +
            "同样是对过往时代亡灵的招魂，且伴以对同时代人的审视，成为她一生的艺术总结。\n" +
            "\n" +
            "本诗选由诗人翻译家王家新编选和翻译。" +
            "译笔力求忠实原作精神，充分体现阿赫玛托娃特有的气质、语调和风格特征，" +
            "刷新和扩展对一位伟大女诗人的认知。"
    },
    {
        bookname: "呐喊",
        author: "鲁迅",
        price: "38",
        rate: 5.0,
        bookpicture: '/bookcovers/book3.jpg',
        id: 3,
        remains: 62,
        description: "《呐喊》收录鲁迅先生1918年至1922年所作小说十四篇。1923年8月由北京新潮社出版，原收十五篇" +
            "，列为该社《文艺丛书》之一。1924年5月第三次印刷时起，" +
            "改由北京北新书局出版，列为鲁迅先生所编的《乌合丛书》之一。" +
            "1930年1 月第十三次印刷时，" +
            "抽去其中的《不周山》一篇(后改名为《补天》，收入《故事新编》)。" +
            "鲁迅先生生前共印行二十二版次。"
    },
    {
        bookname: "都柏林人",
        author: "詹姆斯·乔伊斯",
        price: "28",
        rate: 3.5,
        bookpicture: '/bookcovers/book4.jpg',
        id: 4,
        remains: 0,
        description: "《都柏林人》是詹姆斯·乔伊斯久负盛名的短篇小说集，称得上20世纪整个西方最著名的短篇小说集。" +
            "1914年出版，置景于二三十年代的都柏林，截取中下层人民生活的横断面，一个片刻一群人，十五个故事汇集起来，" +
            "宛若一幅印象主义的绘画，笔触简练，错落成篇，浮现出苍凉世态，遥远、清冷，然而精致，是上上之品。"
    },
    {
        bookname: "1984",
        author: "乔治·奥威尔",
        price: "48",
        rate: 4.2,
        bookpicture: '/bookcovers/book5.jpg',
        id: 5,
        remains: 18,
        description: "《1984》是一部杰出的政治寓言小说，也是一部幻想小说。" +
            "作品刻画了人类在极权主义社会的生存状态，有若一个永不褪色的警示标签，警醒世人提防这种预想中的黑暗成为现实。" +
            "历经几十年，其生命力益显强大，被誉为20世纪影响最为深远的文学经典之一。"
    },
    {
        bookname: "公羊的节日",
        author: "马里奥·巴尔加斯·略萨",
        price: "32",
        rate: 4.2,
        bookpicture: '/bookcovers/book6.png',
        id: 6,
        remains: 77,
        description: "为什么乌拉尼娅在阔别祖国三十五年后回到了这片她发誓永不再踏足的土地？" +
            "为什么她从十四岁开始内心就一直充满恐惧？" +
            "为什么她从不曾探望和问候自己的父亲？面对姑妈的质问，" +
            "乌拉尼娅缓缓诉说起三十多年前的伤痛记忆，那些错综复杂的政治阴谋，还有那个毁了她一生的秘密……\n" +
            "\n" +
            "略萨用写实的笔法，三线并呈的叙述结构，描述了乌拉尼娅对往事的追忆、多米尼加共和国独裁者特鲁希略如何开始一天的生活以及一场令人屏息的暗杀行动，" +
            "揭示了独裁、权势、腐败与性之间的神秘关系。"
    },
    {
        bookname: "悲惨世界",
        author: "维克托·雨果",
        price: "60",
        rate: 4.9,
        bookpicture: '/bookcovers/book7.jpg',
        id: 7,
        remains: 44,
        description: "一部史诗级作品，探讨正义、怜悯和救赎。通过冉阿让等人的悲惨遭遇以及冉阿让被卞福汝主教感化后一系列令人感动的事迹，" +
            "深刻揭露和批判了19世纪法国封建专制社会的腐朽本质及其罪恶现象，" +
            "对穷苦人民在封建重压下所遭受的剥削欺诈和残酷迫害表示了悲悯和同情。"
    },
    {
        bookname: "世说新语",
        author: "刘义庆",
        price: "22",
        rate: 3.2,
        bookpicture: '/bookcovers/book8.jpg',
        id: 8,
        remains: 3,
        description: "《世说新语》是魏晋名士的群像，魏晋风度的集中展示。魏晋时期是中国历史上少有的关注、宣扬、赞赏人的个性的时期，" +
            "士人们自觉地通过言语、行事展现自己的个性，追求与众不同，表现自己的智慧，流露自己的真情，即“魏晋风度”。" +
            "《世说新语》则通过有倾向性地选择、渲染、描写，为后人集中描绘了一批儒雅为底蕴、深情为基调、聪慧为标志、放纵为表象的魏晋名士。\n" +
            "\n" +
            "《世说新语》文笔简洁明快、语言含蓄隽永、余味无穷,鲁迅曾经评论其“记言则玄远冷峻，记行则高简瑰奇”。作者善于抓住人物的特征，作写意式的描绘。"
    }
];

export default function BookDetail() {
    const {id} = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const selectedBook = bookList.find(item => String(item.id) === id);
        setBook(selectedBook);
    }, [id]);

    if (!book) {
        return (
            <div style={{padding: '24px'}}>
                <Title level={3}>未找到图书</Title>
                <Text type="secondary">请检查图书 ID 是否正确。</Text>
            </div>
        );
    }

    return (

        <div style={{padding: '24px'}}>
            <Row gutter={[32, 24]}>
                <Col xs={24} md={10}>
                    <img
                        src={book.bookpicture}
                        alt={book.bookname}
                        style={{
                            width: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                </Col>

                <Col xs={24} md={14}>
                    <Title level={2}>{book.bookname}</Title>
                    <Text strong>作者：</Text><Text>{book.author}</Text>
                    <br/><br/>
                    <Text strong>评分：</Text>
                    <Rate allowHalf disabled defaultValue={book.rate}/>
                    <br/><br/>
                    <Text strong>价格：</Text>
                    <Text type="danger" style={{fontSize: '18px'}}>￥{book.price}</Text>
                    <br/><br/>
                    <Text strong>存货数量：</Text><Text>{book.remains}</Text>
                    <br/><br/>
                    <Text strong>简介：</Text>
                    <Paragraph style={{marginTop: 12}}>
                        {book.description}
                    </Paragraph>
                    <Space direction="vertical">
                        <Row>
                            <Text strong>购买数量：</Text>
                            <InputNumber
                                min={1}
                                max={book.remains}
                                disabled={book.remains === 0}
                                defaultValue={1}
                            />
                        </Row>
                        <Row>
                            <Space size={15}>
                                <Button type="primary" disabled={book.remains === 0}>
                                    加入购物车
                                </Button>
                                <Button disabled={book.remains === 0}>
                                    购买
                                </Button>
                            </Space>
                        </Row>
                    </Space>

                </Col>
            </Row>
        </div>

    );
}
