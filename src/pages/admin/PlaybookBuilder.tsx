import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Stage, Module } from '@/types/playbook';
import { RichTextEditor } from '@/components/playbook/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditingModule {
  id?: string;
  stage_id: string;
  title: string;
  icon: string;
  module_number: string;
  definition_of_done: string;
  content: any;
  sort_order: number;
  isNew?: boolean;
}

export default function PlaybookBuilder() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stages, setStages] = useState<Stage[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [editingModule, setEditingModule] = useState<EditingModule | null>(null);
  const [saving, setSaving] = useState(false);
  const [brandName, setBrandName] = useState('');

  useEffect(() => { loadData(); }, [clientId]);

  async function loadData() {
    if (!clientId) return;
    const [clientRes, stagesRes, modulesRes] = await Promise.all([
      supabase.from('clients').select('brand_name').eq('id', clientId).single(),
      supabase.from('stages').select('*').eq('client_id', clientId).order('sort_order'),
      supabase.from('modules').select('*').eq('client_id', clientId).order('sort_order'),
    ]);
    setBrandName(clientRes.data?.brand_name || '');
    setStages((stagesRes.data || []) as Stage[]);
    setModules((modulesRes.data || []) as Module[]);
  }

  function addModule(stageId: string) {
    const stageModules = modules.filter(m => m.stage_id === stageId);
    const nextNum = String(stageModules.length + 1).padStart(2, '0');
    setEditingModule({
      stage_id: stageId,
      title: '',
      icon: '📄',
      module_number: nextNum,
      definition_of_done: '',
      content: null,
      sort_order: stageModules.length,
      isNew: true,
    });
  }

  function editModule(mod: Module) {
    setEditingModule({
      id: mod.id,
      stage_id: mod.stage_id,
      title: mod.title,
      icon: mod.icon || '📄',
      module_number: mod.module_number,
      definition_of_done: mod.definition_of_done || '',
      content: mod.content,
      sort_order: mod.sort_order,
    });
  }

  async function saveModule() {
    if (!editingModule || !clientId) return;
    setSaving(true);

    const payload = {
      client_id: clientId,
      stage_id: editingModule.stage_id,
      title: editingModule.title,
      icon: editingModule.icon,
      module_number: editingModule.module_number,
      definition_of_done: editingModule.definition_of_done,
      content: editingModule.content,
      sort_order: editingModule.sort_order,
    };

    if (editingModule.id) {
      const { error } = await supabase.from('modules').update(payload).eq('id', editingModule.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('modules').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setSaving(false); return; }
    }

    toast({ title: 'Module saved' });
    setEditingModule(null);
    setSaving(false);
    loadData();
  }

  async function deleteModule(moduleId: string) {
    if (!confirm('Delete this module?')) return;
    await supabase.from('modules').delete().eq('id', moduleId);
    toast({ title: 'Module deleted' });
    loadData();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(`/admin/clients/${clientId}`)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> {brandName}
          </button>
          <h2 className="text-sm font-semibold text-foreground">Playbook Builder</h2>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {editingModule ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingModule.isNew ? 'New Module' : 'Edit Module'}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingModule(null)}>Cancel</Button>
                <Button size="sm" onClick={saveModule} disabled={saving || !editingModule.title.trim()} className="bg-sky-500 hover:bg-sky-600 text-white">
                  <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium block mb-1.5">Title</label>
                <Input value={editingModule.title} onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} placeholder="Module title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Icon</label>
                  <Input value={editingModule.icon} onChange={e => setEditingModule({ ...editingModule, icon: e.target.value })} placeholder="📄" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Number</label>
                  <Input value={editingModule.module_number} onChange={e => setEditingModule({ ...editingModule, module_number: e.target.value })} placeholder="01" className="font-mono" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Definition of Done</label>
              <Input
                value={editingModule.definition_of_done}
                onChange={e => setEditingModule({ ...editingModule, definition_of_done: e.target.value })}
                placeholder="What must be true for this module to be considered complete?"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Content</label>
              <RichTextEditor
                content={editingModule.content}
                onChange={(content) => setEditingModule({ ...editingModule, content })}
                clientId={clientId}
              />
            </div>
          </div>
        ) : (
          stages.sort((a, b) => a.sort_order - b.sort_order).map(stage => {
            const stageModules = modules.filter(m => m.stage_id === stage.id).sort((a, b) => a.sort_order - b.sort_order);
            return (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Stage {stage.stage_number}: {stage.title}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => addModule(stage.id)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Module
                  </Button>
                </div>

                {stageModules.length === 0 ? (
                  <div className="border border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                    No modules yet. Add the first one.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {stageModules.map(mod => (
                      <div key={mod.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card group">
                        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                        <span className="font-mono text-xs text-muted-foreground w-6">{mod.module_number}</span>
                        <span>{mod.icon}</span>
                        <span className="flex-1 text-sm font-medium">{mod.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => editModule(mod)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteModule(mod.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

// Need Edit icon import
import { Edit } from 'lucide-react';
