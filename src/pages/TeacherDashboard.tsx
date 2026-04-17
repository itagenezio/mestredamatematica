import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    BarChart3,
    Trophy,
    Target,
    ArrowLeft,
    Search,
    BookOpen,
    Filter,
    Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { getRankings } from '@/utils/storage';
import { Ranking as RankingType } from '@/types';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
    const [students, setStudents] = useState<RankingType[]>([]);

    useEffect(() => {
        // Carrega rankings locais (ou mockados se vazio)
        const data = getRankings();
        setStudents(data);
    }, []);

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    const chartData = filteredStudents.slice(0, 10).map(s => ({
        name: s.studentName,
        xp: s.xp
    }));

    const gradeDistribution = [
        { name: '6º Ano', value: students.filter(s => s.grade === 6).length },
        { name: '7º Ano', value: students.filter(s => s.grade === 7).length },
        { name: '8º Ano', value: students.filter(s => s.grade === 8).length },
        { name: '9º Ano', value: students.filter(s => s.grade === 9).length },
    ];

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <header className="glass sticky top-0 z-50 p-4 border-b border-white/20">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/')}
                            className="text-primary hover:bg-primary/10 rounded-xl"
                        >
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-2xl font-black text-slate-800">Dashboard do <span className="text-primary">Professor</span></h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex bg-white/50 px-4 py-2 rounded-full border border-white shadow-sm items-center gap-2">
                            <Users size={18} className="text-primary" />
                            <span className="font-bold text-slate-600">{students.length} Alunos Ativos</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Alunos', val: students.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { title: 'XP Acumulado', val: students.reduce((acc, s) => acc + s.xp, 0), icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { title: 'Mestre da Classe', val: students[0]?.studentName || '-', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { title: 'Precisão Média', val: '84%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                        <p className="text-2xl font-black text-slate-800">{stat.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts */}
                    <Card className="lg:col-span-2 border-none shadow-sm h-[450px]">
                        <CardHeader>
                            <CardTitle className="text-slate-800 flex items-center gap-2">
                                <BarChart3 className="text-primary" />
                                Top 10 Alunos (XP)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="xp" radius={[8, 8, 0, 0]}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm h-[450px]">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Distribuição por Série</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={gradeDistribution}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {gradeDistribution.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                                {gradeDistribution.map((g, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="text-xs font-bold text-slate-600">{g.name}: {g.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Table */}
                    <Card className="lg:col-span-3 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                            <div>
                                <CardTitle className="text-slate-800">Lista Geral de Alunos</CardTitle>
                                <CardDescription>Monitore o desempenho individual de cada estudante.</CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <Input
                                        placeholder="Buscar aluno..."
                                        className="pl-10 w-[250px] rounded-full bg-slate-50 border-slate-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant={selectedGrade === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedGrade('all')} className="rounded-full px-4">Todos</Button>
                                    {[6, 7, 8, 9].map(g => (
                                        <Button key={g} variant={selectedGrade === g ? 'default' : 'outline'} size="sm" onClick={() => setSelectedGrade(g)} className="rounded-full px-4">{g}º</Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="font-bold text-slate-800">Aluno</TableHead>
                                        <TableHead className="font-bold text-slate-800">Série</TableHead>
                                        <TableHead className="font-bold text-slate-800 text-right">XP Total</TableHead>
                                        <TableHead className="font-bold text-slate-800 text-right">Melhor Pontuação</TableHead>
                                        <TableHead className="font-bold text-slate-800 text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((s) => (
                                        <TableRow key={s.studentId} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                            <TableCell className="font-bold text-slate-700">{s.studentName}</TableCell>
                                            <TableCell className="text-slate-500 font-medium">{s.grade}º Ano</TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-black text-primary">{s.xp}</span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-600">
                                                {s.score}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.xp > 500 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {s.xp > 500 ? 'Excelente' : 'Em Progresso'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                                                Ninguém encontrado nesta série ainda.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
