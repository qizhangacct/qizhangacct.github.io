const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { age, gender, bubble_tea } = JSON.parse(event.body);
    const data = `\n${age},${gender},${bubble_tea}`;
    
    // Get current file content
    const fileResponse = await fetch('https://api.github.com/repos/qizhangacct/qizhangacct.github.io/contents/data.csv', {
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'Netlify-Serverless'
        }
    });
    
    const fileData = await fileResponse.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const newContent = content + data;
    
    // Update file
    await fetch('https://api.github.com/repos/qizhangacct/qizhangacct.github.io/contents/data.csv', {
        method: 'PUT',
        headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'Netlify-Serverless'
        },
        body: JSON.stringify({
            message: 'Add survey response',
            content: Buffer.from(newContent).toString('base64'),
            sha: fileData.sha
        })
    });

    return {
        statusCode: 200,
        body: 'OK'
    };
};