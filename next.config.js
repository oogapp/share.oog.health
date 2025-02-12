module.exports = {
    async headers() {
      return [
        {
          source: '/.well-known/apple-app-site-association',
          headers: [
            {
                key: 'Content-Type',
                value: 'application/json',
                },
                {
                key: 'Cache-Control',
                value: 'public, max-age=43200, must-revalidate',
            }
          ],
        },
      ]
    },
  }
