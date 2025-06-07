import fetch from 'node-fetch';

const TELEGRAM_BOT_TOKEN = '8171152997:AAHRBL4H5zPBem695y-cPH_gcN_z6vczQB8';
const TELEGRAM_CHAT_ID = '7686888014';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  const data = req.body;

  if (!data || typeof data.totalPoints !== 'number') {
    return res.status(400).json({ status: 'fail', message: 'Invalid data' });
  }

  const message = `New Daily Tracker submission:\n
Name: ${data.name || 'Unknown'}
Study Time: ${data.studyTime} hrs
Prayer Points: ${data.prayerPoints}
Earned Points: ${data.earnedPoints}
Total Points: ${data.totalPoints}`;

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      throw new Error(telegramData.description || 'Telegram API error');
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
}
