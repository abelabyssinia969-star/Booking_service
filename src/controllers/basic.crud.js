exports.crudController = (Model) => ({
  create: async (req, res) => { try { const item = await Model.create(req.body); return res.status(201).json(item); } catch (e) { return res.status(500).json({ message: e.message }); } },
  list: async (req, res) => { try { const items = await Model.find().sort({ createdAt: -1 }); return res.json(items); } catch (e) { return res.status(500).json({ message: e.message }); } },
  get: async (req, res) => { try { const item = await Model.findById(req.params.id); if (!item) return res.status(404).json({ message: 'Not found' }); return res.json(item); } catch (e) { return res.status(500).json({ message: e.message }); } },
  update: async (req, res) => { try { const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!item) return res.status(404).json({ message: 'Not found' }); return res.json(item); } catch (e) { return res.status(500).json({ message: e.message }); } },
  remove: async (req, res) => { try { const r = await Model.findByIdAndDelete(req.params.id); if (!r) return res.status(404).json({ message: 'Not found' }); return res.json({ ok: true }); } catch (e) { return res.status(500).json({ message: e.message }); } },
});

