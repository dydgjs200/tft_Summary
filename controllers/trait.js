const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config(); // .env 파일 로드

// S3 연동
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-2", // 기본값으로 ap-northeast-2 설정
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 모든 Trait
exports.AllTrait = async (req, res) => {
  try {
    const params = {
      Bucket: "tft-summary-s3-bucket",
      Prefix: "tft-trait",
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3Client.send(command);

    // URL 생성 (region 명시)
    const region = process.env.AWS_REGION || "ap-northeast-2";
    const imageUrls = response.Contents.map((item) => {
      return `https://${params.Bucket}.s3.${region}.amazonaws.com/${item.Key}`;
    });

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Error fetching traits from S3:", error);
    res.status(500).json({ error: "Failed to fetch traits" });
  }
};
