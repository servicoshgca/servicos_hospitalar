'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { api } from '@/lib/api';

interface ConfiguracaoRefeitorio {
  id: string;
  valorCafe: number;
  valorAlmoco: number;
  valorJantar: number;
  valorCeia: number;
  
  // Horários do refeitório por tipo de refeição
  horarioInicioCafe: string;
  horarioFimCafe: string;
  horarioInicioAlmoco: string;
  horarioFimAlmoco: string;
  horarioInicioJantar: string;
  horarioFimJantar: string;
  horarioInicioCeia: string;
  horarioFimCeia: string;
  
  // Horários para pedidos por tipo de refeição
  horarioInicioPedidosCafe: string;
  horarioFimPedidosCafe: string;
  horarioInicioPedidosAlmoco: string;
  horarioFimPedidosAlmoco: string;
  horarioInicioPedidosJantar: string;
  horarioFimPedidosJantar: string;
  horarioInicioPedidosCeia: string;
  horarioFimPedidosCeia: string;
  
  // Horários para dietas
  horarioInicioDietas: string;
  horarioFimDietas: string;
  
  ativo: boolean;
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<ConfiguracaoRefeitorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [stringValues, setStringValues] = useState({
    valorCafe: '',
    valorAlmoco: '',
    valorJantar: '',
    valorCeia: ''
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.get('/refeitorio/configuracao');
      if (response.data) {
        setConfig(response.data);
        // Inicializar string values
        setStringValues({
          valorCafe: response.data.valorCafe ? response.data.valorCafe.toString() : '',
          valorAlmoco: response.data.valorAlmoco ? response.data.valorAlmoco.toString() : '',
          valorJantar: response.data.valorJantar ? response.data.valorJantar.toString() : '',
          valorCeia: response.data.valorCeia ? response.data.valorCeia.toString() : ''
        });
      } else {
        // Criar configuração padrão se não existir
        const defaultConfig = {
          id: '',
          valorCafe: 0,
          valorAlmoco: 0,
          valorJantar: 0,
          valorCeia: 0,
          horarioInicioCafe: '06:00',
          horarioFimCafe: '10:00',
          horarioInicioAlmoco: '11:00',
          horarioFimAlmoco: '14:00',
          horarioInicioJantar: '17:00',
          horarioFimJantar: '20:00',
          horarioInicioCeia: '20:00',
          horarioFimCeia: '22:00',
          horarioInicioPedidosCafe: '06:00',
          horarioFimPedidosCafe: '09:00',
          horarioInicioPedidosAlmoco: '10:00',
          horarioFimPedidosAlmoco: '13:00',
          horarioInicioPedidosJantar: '16:00',
          horarioFimPedidosJantar: '19:00',
          horarioInicioPedidosCeia: '19:00',
          horarioFimPedidosCeia: '21:00',
          horarioInicioDietas: '06:00',
          horarioFimDietas: '20:00',
          ativo: true,
        };
        setConfig(defaultConfig);
        setStringValues({
          valorCafe: '',
          valorAlmoco: '',
          valorJantar: '',
          valorCeia: ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    // Função para converter string para float preservando decimais
    const convertToFloat = (value: string) => {
      if (!value || value.trim() === '') return 0;
      
      console.log(`Convertendo: "${value}"`);
      
      // Remove espaços e converte vírgula para ponto
      const cleanValue = value.trim().replace(',', '.');
      console.log(`Após limpeza: "${cleanValue}"`);
      
      // Se termina com ponto, adiciona zero
      const finalValue = cleanValue.endsWith('.') ? cleanValue + '0' : cleanValue;
      console.log(`Valor final: "${finalValue}"`);
      
      const num = parseFloat(finalValue);
      console.log(`Número convertido: ${num} (tipo: ${typeof num})`);
      
      return isNaN(num) ? 0 : num;
    };
    
    // Converter string values para números antes de salvar
    const configToSave = {
      ...config,
      valorCafe: convertToFloat(stringValues.valorCafe),
      valorAlmoco: convertToFloat(stringValues.valorAlmoco),
      valorJantar: convertToFloat(stringValues.valorJantar),
      valorCeia: convertToFloat(stringValues.valorCeia)
    };
    
    console.log('String values:', stringValues);
    console.log('Salvando configurações:', configToSave);
    console.log('Valores dos campos:', {
      valorCafe: configToSave.valorCafe,
      valorAlmoco: configToSave.valorAlmoco,
      valorJantar: configToSave.valorJantar,
      valorCeia: configToSave.valorCeia
    });
    
    setSaving(true);
    try {
      // Sempre usa POST para criar/atualizar
      const response = await api.post('/refeitorio/configuracao', configToSave);
      
      // Atualiza o config com o ID retornado
      setConfig({ ...configToSave, id: response.data.id });
      
      // Atualiza os string values com os valores salvos
      setStringValues({
        valorCafe: response.data.valorCafe ? response.data.valorCafe.toString() : '',
        valorAlmoco: response.data.valorAlmoco ? response.data.valorAlmoco.toString() : '',
        valorJantar: response.data.valorJantar ? response.data.valorJantar.toString() : '',
        valorCeia: response.data.valorCeia ? response.data.valorCeia.toString() : ''
      });
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return '';
    return value.toString();
  };

  const parseCurrency = (value: string) => {
    if (!value || value.trim() === '') return 0;
    
    console.log('Valor original:', value);
    
    // Converte vírgula para ponto (formato brasileiro)
    const normalizedValue = value.replace(',', '.');
    console.log('Valor normalizado:', normalizedValue);
    
    // Se termina com ponto, adiciona zero
    const finalValue = normalizedValue.endsWith('.') ? normalizedValue + '0' : normalizedValue;
    console.log('Valor final:', finalValue);
    
    // Tenta converter diretamente para float
    const num = parseFloat(finalValue);
    console.log('Número convertido:', num);
    
    return isNaN(num) ? 0 : num;
  };

  const getDisplayValue = (field: keyof typeof stringValues) => {
    return stringValues[field];
  };

  const handleCurrencyChange = (field: keyof typeof stringValues, value: string) => {
    console.log(`Campo: ${field}, Valor digitado: "${value}"`);
    
    setStringValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!config) {
    return <div className="p-6">Erro ao carregar configurações</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações do Refeitório</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Valores das Refeições */}
        <Card>
          <CardHeader>
            <CardTitle>Valores das Refeições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorCafe">Café</Label>
                <Input
                  id="valorCafe"
                  type="text"
                  placeholder="0.00"
                  value={getDisplayValue('valorCafe')}
                  onChange={(e) => handleCurrencyChange('valorCafe', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="valorAlmoco">Almoço</Label>
                <Input
                  id="valorAlmoco"
                  type="text"
                  placeholder="0.00"
                  value={getDisplayValue('valorAlmoco')}
                  onChange={(e) => handleCurrencyChange('valorAlmoco', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="valorJantar">Jantar</Label>
                <Input
                  id="valorJantar"
                  type="text"
                  placeholder="0.00"
                  value={getDisplayValue('valorJantar')}
                  onChange={(e) => handleCurrencyChange('valorJantar', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="valorCeia">Ceia</Label>
                <Input
                  id="valorCeia"
                  type="text"
                  placeholder="0.00"
                  value={getDisplayValue('valorCeia')}
                  onChange={(e) => handleCurrencyChange('valorCeia', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={config.ativo}
                onCheckedChange={(checked) => setConfig({ ...config, ativo: checked })}
              />
              <Label htmlFor="ativo">Sistema Ativo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Horários do Refeitório */}
        <Card>
          <CardHeader>
            <CardTitle>Horários de Funcionamento do Refeitório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Café</Label>
                <Input
                  type="time"
                  value={config.horarioInicioCafe}
                  onChange={(e) => setConfig({ ...config, horarioInicioCafe: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimCafe}
                  onChange={(e) => setConfig({ ...config, horarioFimCafe: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Almoço</Label>
                <Input
                  type="time"
                  value={config.horarioInicioAlmoco}
                  onChange={(e) => setConfig({ ...config, horarioInicioAlmoco: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimAlmoco}
                  onChange={(e) => setConfig({ ...config, horarioFimAlmoco: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Jantar</Label>
                <Input
                  type="time"
                  value={config.horarioInicioJantar}
                  onChange={(e) => setConfig({ ...config, horarioInicioJantar: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimJantar}
                  onChange={(e) => setConfig({ ...config, horarioFimJantar: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Ceia</Label>
                <Input
                  type="time"
                  value={config.horarioInicioCeia}
                  onChange={(e) => setConfig({ ...config, horarioInicioCeia: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimCeia}
                  onChange={(e) => setConfig({ ...config, horarioFimCeia: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários para Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Horários para Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Café</Label>
                <Input
                  type="time"
                  value={config.horarioInicioPedidosCafe}
                  onChange={(e) => setConfig({ ...config, horarioInicioPedidosCafe: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimPedidosCafe}
                  onChange={(e) => setConfig({ ...config, horarioFimPedidosCafe: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Almoço</Label>
                <Input
                  type="time"
                  value={config.horarioInicioPedidosAlmoco}
                  onChange={(e) => setConfig({ ...config, horarioInicioPedidosAlmoco: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimPedidosAlmoco}
                  onChange={(e) => setConfig({ ...config, horarioFimPedidosAlmoco: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Jantar</Label>
                <Input
                  type="time"
                  value={config.horarioInicioPedidosJantar}
                  onChange={(e) => setConfig({ ...config, horarioInicioPedidosJantar: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimPedidosJantar}
                  onChange={(e) => setConfig({ ...config, horarioFimPedidosJantar: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <Label className="text-sm font-medium">Ceia</Label>
                <Input
                  type="time"
                  value={config.horarioInicioPedidosCeia}
                  onChange={(e) => setConfig({ ...config, horarioInicioPedidosCeia: e.target.value })}
                />
                <Input
                  type="time"
                  value={config.horarioFimPedidosCeia}
                  onChange={(e) => setConfig({ ...config, horarioFimPedidosCeia: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários para Dietas */}
        <Card>
          <CardHeader>
            <CardTitle>Horários para Solicitação de Dietas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horarioInicioDietas">Início</Label>
                <Input
                  id="horarioInicioDietas"
                  type="time"
                  value={config.horarioInicioDietas}
                  onChange={(e) => setConfig({ ...config, horarioInicioDietas: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="horarioFimDietas">Fim</Label>
                <Input
                  id="horarioFimDietas"
                  type="time"
                  value={config.horarioFimDietas}
                  onChange={(e) => setConfig({ ...config, horarioFimDietas: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 