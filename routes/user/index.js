const router = require("express").Router();
const controller = require("../../controllers/user");

/**
 * @swagger
 * paths:
 *  /user/:userId:
 *    get:
 *      summary: "유저(gameName) 데이터 조회"
 *      description: "/user/:gameName"
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: 특정 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            {
                                    * "id": 1,
                                        "gameName": "시무룩한 개구리",
                                        "tagLine": "KR1",
                                        "region": "asia",
                                        "puuid": "SsrdUhh-frXtzoBuTml1RofD_SSEenvpDPcqw8bTv0bDxhPA2m9czfNn3Li7ghxXliZj48yZWohG5w",
                                        "summonerId": "SYx1uuF2n7KuIgRHlkmOXeVJEB5024pzLL2Q57vsa1uiNeM",
                                        "accountId": null,
                                        "profileIconId": "21",
                                        "tier": "CHALLENGER",
                                        "rank": "I",
                                        "leaguePoints": 1694,
                                        "wins": 340,
                                        "losses": 207,
                                        "matchList":[]
 *                            }
 *                          ]
 */
//router.get("/", controller.getAllUsers);
router.post(
  "/:gameName",
  controller.findUser,
  controller.getUserInfo,
  controller.getUserMatchHistory,
  controller.getUserMatchDetails,
);

module.exports = router;
