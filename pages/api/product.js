const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
}

const products = [];

function handler(req, res) {
    if (req.method === 'POST') {
        const product = req.body && req.body.product;
        console.log(product);
        if (!product || !product.id) {
            return res.status(400).json({ error: 'Invalid product' });
        }
        products.push(product);
        return res.status(200).json({ id: product.id });
    }
    if (req.method === 'GET') {
        const id = req.query.id;
        if (!id) {
            return res.status(200).json({ products });
        }
        return res.status(200).json({product: products.find(el => el.id === +id)});
    }
    if (req.method === 'PUT') {
        const product = req.body && req.body.product;
        if (!product || !product.id) {
            return res.status(400).json({ error: 'Invalid product' });
        }
        const index = products.findIndex(el => el.id === +product.id);
        if (index === -1) {
            return res.status(400).json({ error: 'Invalid product' });
        }
        products[index] = product;
        return res.status(200).json({ id: +product.id });
    }
    if (req.method === 'DELETE') {
        console.log(req.body);
        const id = req.body.id;
        if (!id) {
            return res.status(400).json({ error: 'Invalid id' });
        }
        const index = products.findIndex(el => el.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'id not found' });
        }
        products.splice(index, 1);
        return res.status(200).json({ id: +id });
    }
    return res.status(200).send();
}

module.exports = allowCors(handler);