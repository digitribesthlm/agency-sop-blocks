
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = process.env.AIRTABLE_SECRET_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_TABLE_ID;
    
    if (!token || !baseId || !tableId) {
      return res.status(500).json({ 
        error: 'Airtable not configured',
        message: 'AIRTABLE_SECRET_TOKEN, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_ID must be set in environment variables'
      });
    }
    
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const allRecords = [];
    let offset = null;
    
    while (true) {
      const params = offset ? { offset } : {};
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${airtableUrl}?${queryString}` : airtableUrl;
      
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        console.error('Airtable API error:', response.status);
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      allRecords.push(...(data.records || []));
      
      if (data.offset) {
        offset = data.offset;
      } else {
        break;
      }
    }
    
    res.json({ records: allRecords });
  } catch (error) {
    console.error('Error fetching Airtable data');
    res.status(500).json({ 
      error: 'Failed to fetch Airtable data',
      message: 'Unable to retrieve data from Airtable'
    });
  }
}

