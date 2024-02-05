const app = getApp();
/**
 * 获取全部公告信息
 *
 * @author chadwuo
 */
exports.getNotice = async () => {
    const db = app.mpserverless.db;
    const dataScope = app.userDataScope
    try {
        const {
            result
        } = await db.collection('notice').find({
            status: "显示"
        })
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