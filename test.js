const fs = require('fs');
const path = require('path');
const http = require('http');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const file = fs.createWriteStream(dest);
      http
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              resolve();
            });
          });
        })
        .on('error', (err) => {
          fs.unlink(dest, () => {
            console.error(`Error downloading file: ${err.message}`);
            reject(err);
          });
        });
    } catch (error) {
      reject(error);
    }
  });
};

// 设置 Gradio 服务器的 URL
const getVoiceUrl = () => 'http://58.58.123.198:8082/';

const convertUrl = (url) => {
  return url
    .replace(/http:\/\/\d+\.\d+\.\d+\.\d+(?::\d+)?\//, getVoiceUrl())
    .replace(/\\/g, `/`);
};

// 生成音频的函数
async function generateAudio(
  text,
  modelName,
  emotion = 0.2,
  noiseScale = 0.5,
  noiseScaleW = 0.9,
  speed = 1,
  filename = null,
) {
  // 记录整个函数的开始时间
  const startTime = performance.now();

  const voiceUrl = getVoiceUrl();
  const tempPath = path.join(__dirname, 'media', 'temp_voice');

  // 创建目录（如果不存在的话）
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
  }

  // 验证参数范围
  speed = Math.max(0.1, Math.min(2.0, speed));
  emotion = Math.max(0.1, Math.min(1.0, emotion));
  noiseScale = Math.max(0.1, Math.min(1.0, noiseScale));
  noiseScaleW = Math.max(0.1, Math.min(1.0, noiseScaleW));

  try {
    // 记录 client.predict 的时间
    const predictStartTime = performance.now();

    // 创建 Gradio 客户端实例

    const importDynamic = new Function(
      'modulePath',
      'return import(modulePath)',
    );
    const { Client } = await importDynamic('@gradio/client');
    const client = await Client.connect(voiceUrl);

    const inferResult = await client.predict('/infer', {
      text,
      sdp_ratio: emotion,
      noise_scale: noiseScale,
      noise_scale_w: noiseScaleW,
      length_scale: speed,
      sid: modelName,
    });

    console.log('inferResult', inferResult);
    // console.log('inferResult', Boolean(inferResult));
    if (!inferResult?.data?.[1])
      throw new AudioGenerationException({ stack: '' });
    const { url: audio } = inferResult.data[1];


    const predictEndTime = performance.now();
    const predictDuration = (predictEndTime - predictStartTime) / 1000; // 秒
    console.log(`生成音频耗时: ${predictDuration.toFixed(4)} 秒`);
    console.log(`音频文件路径: ${audio}`);

    // 设置文件名
    filename = filename
      ? `${filename}.wav`
      : `temp_${
          Date.now().toString(36) + Math.random().toString(36).substring(2)
        }.wav`;
    const filePath = path.join(tempPath, filename);

    // 记录文件复制的时间
    const fileCopyStartTime = performance.now();

    // 复制文件
    await downloadFile(audio, filePath);

    // 删除临时文件
    // fs.unlinkSync(audio);

    const fileCopyEndTime = performance.now();
    const fileCopyDuration = (fileCopyEndTime - fileCopyStartTime) / 1000; // 秒
    console.log(`文件复制和删除耗时: ${fileCopyDuration.toFixed(4)} 秒`);

    // 记录总耗时
    const endTime = performance.now();
    const totalDuration = (endTime - startTime) / 1000; // 秒
    console.log(`整个函数的总耗时: ${totalDuration.toFixed(4)} 秒`);

    // 返回音频文件路径
    return filePath;
  } catch (error) {
    console.error(`音频生成失败: ${error}`);
    console.error(error);
    return null;
  }
}

for (let i = 0; i < 1; i++) {
  const text = `你好，我是${i}号用户，`;
  // 调用示例
  generateAudio(
    text +
      '{过几天|等过几天|明天|等明|过两天|再过两天|等过两天}{抢|拍|买|下单|购买}下的话呢，{力度|价格|福利|优惠}全部恢复到{咱们|我们}日常{力度|价格|福利|优惠}，恢复到{咱们|我们}日常{力度|价格|福利|优惠}，日常{力度|价格|福利|优惠}呢，会比{现在这场直播|这次直播|本场直播|今天|这场直播|现在|现在呢|现在啊|目前|目前呢|目前啊}的{这个|这种|现在这个|目前这个}现货名额的{力度|价格|福利|优惠}，它{需要|一定要|要}贵个十块，贵个二十块钱的，您{过几天|等过几天|明天|等明天|过两天|再过两天|等过两天}来{抢|拍|买|下单|购买}也可以啊，但是您{千万不要|不要|都不要|可不要|一定不要|真的不要}{讲|说}{妹妹|主播|小妹|老妹|小妹我|妹妹我|老妹我}没有提醒你了啊。',
    'biyao',
  ).then((path) => {
    if (path) {
      console.log('生成的音频文件路径:', path);
    } else {
      console.log('音频生成失败');
    }
  });
}
