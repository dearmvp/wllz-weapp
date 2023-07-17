const app = getApp();

/**
 * 获取用户信息
 * 如果没有会自动创建用户
 *
 * @author chadwuo
 */
exports.getUserInfo = async () => {
	const {
		mpserverless
	} = app
	const db = mpserverless.db;
	try {
		const res = await mpserverless.user.getInfo()
		if (!res.success) {
			throw new Error("操作失败");
		}
		const userId = res.result.user.userId // Serverless平台生成的用户ID
		const oAuthUserId = res.result.user.oAuthUserId // 用户的支付宝/钉钉/微信身份ID。
		const createdAt = res.result.user.createdAt // 该用户首次登录的时间戳（毫秒）。
		const lastSeenAt = res.result.user.lastSeenAt // 该用户最近登录的时间戳（毫秒）。

		let {
			result: user
		} = await db.collection('user').findOne({
			_id: userId
		})
		if (!user) {
			// 创建用户
			user = {
				_id: userId,
				oAuthUserId: oAuthUserId,
				createdAt: createdAt,
				lastSeenAt: lastSeenAt,
				nickName: '微信用户',
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				isVip: false,
				createTime: new Date(),
				updateTIme: new Date(),
			}
			await db.collection('user').insertOne(user)
		} else {

			try {
				await db.collection('user').updateOne({
					_id: userId
				}, {
					$set: {
						oAuthUserId: oAuthUserId,
						createdAt: createdAt,
						lastSeenAt: lastSeenAt,
					}
				})
			} catch (e) {
				return {
					success: false,
					message: e
				};
			}
		}

		return {
			success: true,
			data: user
		}
	} catch (e) {
		return {
			success: false,
			message: e
		};
	}
}

/**
 * 更新用户数据
 *
 * @author chadwuo
 */
exports.updateUserInfo = async (parameter) => {
	const db = app.mpserverless.db;
	try {
		await db.collection('user').updateOne({
			_id: parameter._id
		}, {
			$set: {
				nickName: parameter.nickName,
				avatarUrl: parameter.avatarUrl,
				updateTIme: new Date(),
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
 * 获取用户数据范围
 *
 * @return data {Array.<string>} 用户id集合。
 * @author chadwuo
 */
exports.getUserDataScope = async () => {
	const userInfo = app.userInfo
	const db = app.mpserverless.db;
	// 获取家庭信息
	const {
		result: familyMember
	} = await db.collection('family_member').findOne({
		userId: userInfo._id
	})

	// 没有加入家庭，就返回自己的id
	if (!familyMember) {
		return [userInfo._id]
	}

	// 获取家庭其他成员信息
	const {
		result: familyInfos
	} = await db.collection('family_member').find({
		familyId: familyMember.familyId
	})

	let dataScope = familyInfos.map(i => {
		return i.userId
	})

	if (!dataScope || dataScope.length == 0) {
		return [userInfo._id]
	}

	return dataScope
}

/**
 * 更新用户积分
 *
 */
exports.updateUserScore = async (parameter) => {
	const db = app.mpserverless.db;
	try {
		let {
			result: user
		} = await db.collection('user').findOne({
			_id: parameter.shareUserId
		})
		if (user) {
			const userInfo = app.userInfo
			//查找用户是否已分享多次分享记1次
			let {
				result: userShare
			} = await db.collection('user_share').findOne({
				userId: userInfo._id,
				shareUserId: parameter.shareUserId
			})
			if (!userShare) {
				await db.collection('user').updateOne({
					_id: parameter.shareUserId
				}, {
					$set: {
						score: Number(user.score) + 3,
						updateTIme: new Date()
					}
				})
				await db.collection('user_share').insertOne({
					userId: app.userInfo._id,
					shareUserId: parameter.shareUserId,
					createTime: new Date(),
				})
			}

		}
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