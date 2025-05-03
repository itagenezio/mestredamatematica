
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GradeLevel, Student } from "@/types";
import { saveStudent } from "@/utils/storage";
import { toast } from "@/components/ui/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (student: Student) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(6);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, digite seu nome');
      return;
    }
    
    if (!grade) {
      setError('Por favor, selecione sua série');
      return;
    }
    
    const student: Student = {
      id: Date.now().toString(),
      name: name.trim(),
      grade,
      createdAt: new Date()
    };
    
    saveStudent(student);
    toast({
      title: "Cadastro realizado!",
      description: `Bem-vindo(a) ${name}! Você está pronto para jogar.`,
    });
    
    onComplete(student);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Cadastro de Aluno</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="border-2 border-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Série escolar</Label>
            <RadioGroup 
              value={String(grade)}
              onValueChange={(value) => setGrade(Number(value) as GradeLevel)}
              className="flex flex-wrap gap-2"
            >
              {[6, 7, 8, 9].map((gradeOption) => (
                <div key={gradeOption} className="flex items-center">
                  <RadioGroupItem
                    value={String(gradeOption)}
                    id={`grade-${gradeOption}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`grade-${gradeOption}`}
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-white peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white peer-focus:ring-2 peer-focus:ring-primary/50 cursor-pointer"
                  >
                    {gradeOption}º
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {error && <p className="text-mathRed text-sm">{error}</p>}
          
          <DialogFooter className="sm:justify-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
