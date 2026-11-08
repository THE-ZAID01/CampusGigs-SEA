import { useState } from 'react';
import Modal from './Modal.jsx';
import api, { errMsg } from '../api/axios.js';

export default function PostGigModal({ categories, onClose, onCreated }) {
  const [f, setF] = useState({ title: '', category: categories[0] || 'Design', budget: '', deadline: '', description: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const today = new Date().toISOString().slice(0, 10);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/gigs', { ...f, budget: Number(f.budget) });
      onCreated(data);
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <Modal title="Post a gig" onClose={onClose} width={580}>
      <form className="stack" onSubmit={submit}>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="field">
          <label htmlFor="g-title">What do you need done?</label>
          <input id="g-title" className="input" value={f.title} onChange={set('title')} placeholder="Design a poster for our club event" maxLength={140} required />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="g-cat">Category</label>
            <select id="g-cat" className="select" value={f.category} onChange={set('category')}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="g-budget">Budget (GigCoins)</label>
            <input id="g-budget" className="input" type="number" min="10" max="100000" step="1" value={f.budget} onChange={set('budget')} placeholder="500" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="g-deadline">Deadline (optional)</label>
          <input id="g-deadline" className="input" type="date" min={today} value={f.deadline} onChange={set('deadline')} />
        </div>
        <div className="field">
          <label htmlFor="g-desc">Details</label>
          <textarea id="g-desc" className="textarea" value={f.description} onChange={set('description')} placeholder="What should the final result look like? Add sizes, formats, references." required />
          <span className="hint">Bids can be lower than your budget. You only pay the bid you accept.</span>
        </div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Posting…' : 'Post gig'}</button>
      </form>
    </Modal>
  );
}
