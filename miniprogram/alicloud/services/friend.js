import pinyin from "wl-pinyin";
const app = getApp();
/**
 * 获取全部亲友数据集合
 *
 * @author chadwuo
 */
// exports.getFriendList = async () => {
//     const db = app.mpserverless.db;
//     const dataScope = app.userDataScope
//     try {
//         const {
//             result
//         } = await db.collection('friend').find({
//             userId: {
//                 $in: dataScope
//             }
//         })

//         return {
//             success: true,
//             data: result
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: error,
//         }
//     }
// };


exports.getFriendList = async () => {
    const db = app.mpserverless.db;
    const dataScope = app.userDataScope
    try {
        const pageSize = 100;
        let minId = {
            $minKey: 1
        };
        var result = [];
        const collection = db.collection('friend');
        while (true) {
            const query = {
                _id: {
                    $gt: minId
                },
                userId: {
                    $in: dataScope
                }
            };
            const options = {
                limit: pageSize,
                sort: {
                    _id: 1
                },
            };
            const findResult = await collection.find(query, options);
            const {
                affectedDocs,
                success
            } = findResult;
            if (!success) {
                throw new Error("find return success false");
            }
            if (affectedDocs > 0) {
                const data = findResult.result;
                const lastDoc = data[data.length - 1];
                minId = lastDoc._id;

                data.forEach(function (element) {
                    result.push(element);
                });

            } else {
                break;
            }
        }
        return {
            success: true,
            data: result
        };

    } catch (error) {
        return {
            success: false,
            message: error,
        }
    }
};

/**
 * 获取亲友数据
 *
 * @author chadwuo
 */
exports.getFriend = async (parameter) => {
    const db = app.mpserverless.db;
    try {
        const {
            result
        } = await db.collection('friend').findOne({
            _id: parameter._id,
        })
        return {
            success: true,
            data: result
        };
    } catch (e) {
        return {
            success: false,
            message: e
        };
    }
};

/**
 * 获取亲友来往数据
 *
 * @author chadwuo
 */
exports.getFriendGifts = async (parameter) => {
    const db = app.mpserverless.db;
    try {
        const {
            result
        } = await db.collection('friend').findOne({
            _id: parameter._id,
        })
        // 送礼集合
        const {
            result: giftOutList
        } = await db.collection('gift_out').find({
            friendId: parameter._id,
        })
        // 收礼集合
        const {
            result: giftReceiveList
        } = await db.collection('gift_receive').aggregate([{
                $match: {
                    friendId: parameter._id
                }
            },
            {
                $sort: {
                    updateTime: -1,
                    _id: -1
                }
            },
            {
                $lookup: { // 左连接
                    from: "book", // 关联到de表
                    localField: "bookId", // 左表关联的字段
                    foreignField: "_id", // 右表关联的字段
                    as: "bookInfo"
                }
            },
            {
                $unwind: { // 拆分子数组
                    path: "$bookInfo",
                    preserveNullAndEmptyArrays: true // 空的数组也拆分
                }
            }
        ])
        return {
            success: true,
            data: {
                ...result,
                giftOutList,
                giftReceiveList
            }
        };
    } catch (e) {
        return {
            success: false,
            message: e
        };
    }
};

/**
 * 添加亲友数据
 *
 * @author chadwuo
 */
exports.addFriend = async (parameter) => {
    const userInfo = app.userInfo
    const db = app.mpserverless.db;
    const currentTime = app.colorUISdk.isDate.formatTime(new Date());
    try {
        const {
            result
        } = await db.collection('friend').insertOne({
            userId: userInfo._id,
            name: parameter.name.trim(),
            firstLetter: pinyin.getFirstLetter(parameter.name.substr(0, 1)),
            relation: parameter.relation,
            remarks: parameter.remarks,
            happyTotal: 0,
            sadTotal: 0,
            createTime: currentTime,
            updateTime: currentTime,
        })
        return {
            success: true,
            data: result.insertedId
        };
    } catch (e) {
        return {
            success: false,
            message: e
        };
    }
};

/**
 * 更新亲友数据
 *
 * @author chadwuo
 */
exports.updateFriend = async (parameter) => {
    const db = app.mpserverless.db;
    const currentTime = app.colorUISdk.isDate.formatTime(new Date());
    try {
        await db.collection('friend').updateOne({
            _id: parameter._id
        }, {
            $set: {
                name: parameter.name.trim(),
                firstLetter: pinyin.getFirstLetter(parameter.name.substr(0, 1)),
                relation: parameter.relation,
                remarks: parameter.remarks,
                updateTime: currentTime,
            }
        })
        return {
            success: true,
            data: ''
        };
    } catch (e) {
        return {
            success: false,
            message: e
        };
    }
};

/**
 * 删除亲友数据
 *
 * @author chadwuo
 */
exports.deleteFriend = async (parameter) => {
    const db = app.mpserverless.db;
    try {
        // 删除亲友下所有送礼记录
        await db.collection('gift_out').deleteMany({
            friendId: parameter._id
        })
        // 删除亲友下所有收礼记录
        await db.collection('gift_receive').deleteMany({
            friendId: parameter._id
        })
        // 删除亲友
        await db.collection('friend').deleteOne({
            _id: parameter._id
        })
        return {
            success: true,
            data: ''
        };
    } catch (e) {
        return {
            success: false,
            message: e
        };
    }
};