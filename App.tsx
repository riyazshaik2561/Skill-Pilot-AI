import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, Award, BarChart3, Bell, BookOpen,
  BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleHelp, Clock3,
  Code2, Compass, FileText, Flame, FolderKanban, Gauge, GraduationCap,
  LayoutDashboard, Lightbulb, Menu, Plus, Search, Settings2, Sparkles,
  Target, TrendingUp, Upload, WandSparkles, X
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from 'recharts';

type Task = { id: number; title: string; detail: string; week: string; hours: number; done: boolean; tag: string };
const initialTasks: Task[] = [
  { id: 1, title: 'Strengthen Python foundations', detail: 'Functions, collections, modules, and clean code', week: 'WEEK 01', hours: 4, done: true, tag: 'FOUNDATION' },
  { id: 2, title: 'Explore data analysis with Pandas', detail: 'Clean a dataset and write five useful insights', week: 'WEEK 01', hours: 5, done: true, tag: 'DATA SKILLS' },
  { id: 3, title: 'Build your first ML pipeline', detail: 'Train, evaluate, and document a baseline model', week: 'WEEK 02', hours: 6, done: false, tag: 'MACHINE LEARNING' },
  { id: 4, title: 'Ship a portfolio-ready project', detail: 'Publish a clean README and a reproducible demo', week: 'WEEK 03', hours: 5, done: false, tag: 'PORTFOLIO' },
];
const roleSkills = [
  { name: 'Python', current: 4, target: 4, color: 'violet' },
  { name: 'Data analysis', current: 3, target: 4, color: 'cyan' },
  { name: 'Machine learning', current: 2, target: 4, color: 'blue' },
  { name: 'SQL', current: 2, target: 3, color: 'pink' },
  { name: 'Deployment', current: 1, target: 3, color: 'orange' },
];
const trend = [
  { week: 'W1', score: 28 }, { week: 'W2', score: 36 }, { week: 'W3', score: 42 },
  { week: 'W4', score: 49 }, { week: 'W5', score: 56 }, { week: 'W6', score: 64 },
  { week: 'W7', score: 70 },
];
const initialProjects = [
  { title: 'Customer Churn Explorer', level: 'INTERMEDIATE', time: '6–8 hours', desc: 'Explore customer behavior and build a baseline churn model.', tags: ['Python', 'Pandas', 'Scikit-learn'], icon: BarChart3 },
  { title: 'Smart Resume Matcher', level: 'INTERMEDIATE', time: '8–10 hours', desc: 'Compare a resume against a role profile with explainable skill matching.', tags: ['NLP', 'FastAPI', 'React'], icon: FileText },
  { title: 'Live Model Insights API', level: 'ADVANCED', time: '10–12 hours', desc: 'Serve a model through an API and add useful health and evaluation endpoints.', tags: ['Python', 'API', 'Docker'], icon: Code2 },
];

const navItems = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Resume Analyzer', icon: FileText },
  { name: 'Skill Intelligence', icon: Target },
  { name: 'Career Roadmap', icon: Compass },
  { name: 'Projects', icon: FolderKanban },
  { name: 'Progress', icon: TrendingUp },
];

export default function App() {
  const [active, setActive] = useState('Overview');
  const [tasks, setTasks] = useState(initialTasks);
  const [role, setRole] = useState('AI / Data Scientist');
  const [level, setLevel] = useState('Student / Beginner');
  const [hours, setHours] = useState('8 hours / week');
  const [resumeName, setResumeName] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [projects, setProjects] = useState(initialProjects);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatAnswer, setChatAnswer] = useState('');
  const completed = tasks.filter(t => t.done).length;
  const progress = Math.round((completed / tasks.length) * 100);
  const filteredTasks = useMemo(() => tasks.filter(t => `${t.title} ${t.detail} ${t.tag}`.toLowerCase().includes(search.toLowerCase())), [tasks, search]);

  function toggleTask(id: number) {
    setTasks(old => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
    setNotice('Your roadmap progress has been updated.');
    window.setTimeout(() => setNotice(''), 2600);
  }
  function handleFile(file?: File) {
    if (!file) return;
    const valid = /\.(pdf|docx)$/i.test(file.name);
    if (!valid) { setNotice('Please select a PDF or DOCX file.'); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice('Please choose a file smaller than 8 MB.'); return; }
    setResumeName(file.name);
    setAnalysisReady(false);
    setNotice('Resume selected. Run demo analysis to preview extracted insights.');
  }
  function runAnalysis() {
    setAnalysisReady(true);
    setActive('Resume Analyzer');
    setNotice('Demo analysis complete. Review the sample findings and edit your profile.');
  }
  function addGoal() {
    if (!newGoal.trim()) return;
    setTasks(old => [...old, { id: Math.max(0, ...old.map(t => t.id)) + 1, title: newGoal.trim(), detail: 'Personal learning milestone — add your own completion evidence', week: 'NEXT UP', hours: 2, done: false, tag: 'PERSONAL GOAL' }]);
    setNewGoal('');
    setNotice('Goal added to your roadmap.');
    window.setTimeout(() => setNotice(''), 2600);
  }
  function askCoach() {
    const q = chatInput.trim();
    if (!q) return;
    const low = q.toLowerCase();
    if (low.includes('resume')) setChatAnswer('Start by making your project outcomes specific. For each project, describe the problem, tools used, your contribution, and a measurable result. SkillPilot can analyze a PDF/DOCX in a connected backend; this preview uses sample insights.');
    else if (low.includes('machine') || low.includes('ml')) setChatAnswer('Your next practical step is to build a baseline model: split data, train a simple model, measure precision/recall, and document what failed. Then compare one improved version.');
    else if (low.includes('job') || low.includes('career')) setChatAnswer(`For ${role}, focus on the highest-impact gaps first: machine learning fundamentals, SQL, and deploying a small project. Keep the plan realistic for ${hours}.`);
    else setChatAnswer('Turn that goal into a small deliverable you can finish this week. Define what “done” means, reserve focused study time, and add the result to your portfolio. This is a demo coach response.');
    setChatInput('');
  }

  const titleMap: Record<string, string> = {
    'Overview': 'Your career, in motion.',
    'Resume Analyzer': 'Understand your starting point.',
    'Skill Intelligence': 'Know what to learn next.',
    'Career Roadmap': 'Make progress every week.',
    'Projects': 'Turn skills into proof.',
    'Progress': 'Every step adds up.',
  };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><WandSparkles size={21} strokeWidth={2.2}/></div>
        <div><div className="brand-name">skillpilot<span>AI</span></div><div className="brand-caption">CAREER INTELLIGENCE</div></div>
        <button className="icon-btn close-mobile" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="nav-list">
        {navItems.map(item => <button key={item.name} className={`nav-item ${active === item.name ? 'active' : ''}`} onClick={() => { setActive(item.name); setMobileNav(false); }}>
          <item.icon size={18}/><span>{item.name}</span>{item.name === 'Projects' && <span className="nav-count">3</span>}
        </button>)}
      </nav>
      <div className="sidebar-spacer"/>
      <div className="upgrade-card">
        <div className="upgrade-icon"><Sparkles size={17}/></div>
        <div className="upgrade-title">Your next chapter starts here.</div>
        <p>Small steps today. A stronger portfolio tomorrow.</p>
        <button onClick={() => setActive('Career Roadmap')} className="upgrade-link">View my roadmap <ArrowRight size={14}/></button>
        <div className="upgrade-glow"/>
      </div>
      <button className="nav-item settings-link" onClick={() => setProfileOpen(!profileOpen)}><Settings2 size={18}/><span>Career settings</span></button>
      <div className="sidebar-user">
        <div className="avatar">SR</div><div className="user-copy"><strong>Student workspace</strong><span>Demo profile</span></div><ChevronDown size={15} className="muted"/>
      </div>
    </aside>
    {mobileNav && <button aria-label="Close menu overlay" className="nav-overlay" onClick={() => setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar">
        <div className="top-left">
          <button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
        </div>
        <div className="top-actions">
          <div className="demo-pill"><span/> DEMO MODE</div>
          <button className="icon-btn search-button" aria-label="Focus task search" onClick={() => { setActive('Career Roadmap'); document.getElementById('task-search')?.focus(); }}><Search size={18}/></button>
          <button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => setNotice('You are all caught up. No new notifications.')}><Bell size={18}/><i/></button>
          <button className="top-avatar" onClick={() => setProfileOpen(!profileOpen)} aria-label="Open career settings">SR</button>
        </div>
      </header>
      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={14}/></button></div>}
      {profileOpen && <div className="settings-popover">
        <div className="popover-heading">Career profile <button className="icon-btn" onClick={() => setProfileOpen(false)} aria-label="Close settings"><X size={15}/></button></div>
        <label>Target role<select value={role} onChange={e => setRole(e.target.value)}><option>AI / Data Scientist</option><option>Software Developer</option><option>Data Analyst</option><option>Cloud Engineer</option><option>AI Engineer</option></select></label>
        <label>Experience level<select value={level} onChange={e => setLevel(e.target.value)}><option>Student / Beginner</option><option>Intermediate</option><option>Career switcher</option></select></label>
        <label>Study time<select value={hours} onChange={e => setHours(e.target.value)}><option>4 hours / week</option><option>8 hours / week</option><option>12 hours / week</option><option>16+ hours / week</option></select></label>
        <button className="btn-primary full-width" onClick={() => {setProfileOpen(false); setNotice('Career profile updated.');}}>Save profile <Check size={15}/></button>
      </div>}
      <div className="page-content">
        <section className="welcome-row">
          <div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL CAREER COPILOT</div><h1>{titleMap[active]}</h1><p className="welcome-sub">A little progress, consistently, can change everything.</p></div>
          <button className="btn-primary" onClick={() => setActive('Resume Analyzer')}><Plus size={17}/> New career analysis</button>
        </section>

        {active === 'Overview' && <>
          <section className="hero-panel">
            <div className="hero-content">
              <div className="hero-badge"><Sparkles size={14}/> YOUR PERSONALIZED PATH</div>
              <h2>You're closer than<br/><span>you think.</span></h2>
              <p>Your path to becoming an <strong>{role}</strong> is taking shape. Keep building skills, shipping projects, and collecting proof of what you can do.</p>
              <div className="hero-buttons"><button className="btn-light" onClick={() => setActive('Career Roadmap')}>Continue roadmap <ArrowRight size={16}/></button><button className="btn-ghost" onClick={() => setActive('Skill Intelligence')}>Explore skill gaps</button></div>
              <div className="hero-footnote"><span className="pulse-dot"/> Your next milestone is within reach</div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
              <div className="orbit-core"><div className="core-inner"><WandSparkles size={34}/></div></div>
              <div className="float-chip chip-top"><span className="chip-dot violet-dot"/> Skills mapped <Check size={13}/></div>
              <div className="float-chip chip-right"><TrendingUp size={15}/><div><strong>+12%</strong><small>skill coverage</small></div></div>
              <div className="float-chip chip-bottom"><CheckCircle2 size={15}/><div><strong>2 milestones</strong><small>completed this week</small></div></div>
              <div className="art-star star-one">✳</div><div className="art-star star-two">✦</div><div className="art-star star-three">·</div>
            </div>
          </section>

          <section className="stats-grid">
            <StatCard label="Skill coverage" value="64%" change="+8% this month" icon={Target} color="purple" foot="Across 12 role skills"/>
            <StatCard label="Roadmap progress" value={`${progress}%`} change={`${completed} of ${tasks.length} tasks done`} icon={Activity} color="cyan" foot="Keep your momentum"/>
            <StatCard label="Learning time" value="6.5h" change="+2.5h this week" icon={Clock3} color="blue" foot="Of your 8h weekly goal"/>
            <StatCard label="Portfolio projects" value="2" change="1 in progress" icon={Award} color="pink" foot="Build proof, not just skills"/>
          </section>

          <section className="content-grid">
            <div className="panel growth-panel">
              <div className="panel-heading"><div><div className="section-kicker">YOUR MOMENTUM</div><h3>Skill coverage over time</h3><p>You're building a stronger foundation.</p></div><button className="select-chip" onClick={() => setActive('Progress')}>Last 7 weeks <ChevronDown size={14}/></button></div>
              <div className="chart-legend"><span/><span>Skill coverage</span><b>+42% <ArrowDownRight size={13}/></b></div>
              <div className="growth-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{top:10,right:4,left:-24,bottom:0}}><defs><linearGradient id="coverageFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9B8AFF" stopOpacity={0.28}/><stop offset="95%" stopColor="#9B8AFF" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#252d40" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill:'#77829a',fontSize:11}} dy={8}/><YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'#77829a',fontSize:11}}/><Tooltip contentStyle={{background:'#151c2d',border:'1px solid #303a50',borderRadius:10,color:'#fff'}} itemStyle={{color:'#b9adff'}}/><Area type="monotone" dataKey="score" name="Coverage" stroke="#9B8AFF" strokeWidth={2.5} fill="url(#coverageFill)" activeDot={{r:5,fill:'#b7aaff',stroke:'#151c2d',strokeWidth:3}}/></AreaChart></ResponsiveContainer></div>
              <div className="chart-bottom"><span><i className="legend-dot"/>Current trajectory</span><span>Illustrative demo data</span></div>
            </div>
            <div className="panel next-panel">
              <div className="panel-heading"><div><div className="section-kicker">ONE STEP AT A TIME</div><h3>Up next</h3></div><button className="text-link" onClick={() => setActive('Career Roadmap')}>View roadmap <ArrowRight size={14}/></button></div>
              <div className="next-feature"><div className="next-icon"><Code2 size={19}/></div><div><span className="tiny-tag">THIS WEEK · 6 HOURS</span><h4>Build your first ML pipeline</h4><p>Turn your Python and data skills into a working model.</p></div></div>
              <div className="next-progress"><div><span>Roadmap completion</span><strong>{progress}%</strong></div><div className="progress-track"><div style={{width:`${progress}%`}}/></div></div>
              <button className="btn-primary full-width" onClick={() => setActive('Career Roadmap')}>Pick up where I left off <ArrowRight size={16}/></button>
              <div className="gentle-note"><Lightbulb size={15}/><span>Tip: a small finished project beats a perfect unfinished one.</span></div>
            </div>
          </section>

          <section className="panel tasks-panel">
            <div className="panel-heading"><div><div className="section-kicker">YOUR PERSONAL PLAN</div><h3>Roadmap tasks</h3><p>Small wins build lasting momentum.</p></div><button className="text-link" onClick={() => setActive('Career Roadmap')}>See all tasks <ArrowRight size={14}/></button></div>
            <div className="task-list">{tasks.slice(0,3).map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask}/>)}</div>
          </section>
        </>}

        {active === 'Resume Analyzer' && <section className="feature-layout">
          <div className="panel feature-main">
            <div className="section-kicker">START WITH WHAT YOU HAVE</div><h2 className="feature-title">Your experience has value.<br/><span>Let's make it visible.</span></h2>
            <p className="feature-copy">Upload a resume to map your current skills to your career goals. You stay in control: review and edit findings before generating your roadmap.</p>
            <label className="upload-zone" htmlFor="resume-file"><div className="upload-symbol"><Upload size={24}/></div><strong>{resumeName || 'Drop your resume here'}</strong><span>PDF or DOCX · Up to 8 MB</span><span className="upload-browse">Choose a file</span><input id="resume-file" type="file" accept=".pdf,.docx,application/pdf" onChange={e => handleFile(e.target.files?.[0])}/></label>
            <div className="privacy-note"><CheckCircle2 size={15}/> Demo mode: the selected file stays in your browser and is not uploaded to a server.</div>
            <button className="btn-primary" disabled={!resumeName} onClick={runAnalysis}><Sparkles size={16}/> Analyze resume <ArrowRight size={15}/></button>
            {analysisReady && <div className="analysis-results"><div className="result-header"><CheckCircle2 size={19}/><div><strong>Sample analysis ready</strong><span>Illustrative findings — not extracted from your document</span></div></div><div className="result-grid"><div><small>Potential skills to review</small><strong>Python · SQL · Data analysis</strong></div><div><small>Suggested next step</small><strong>Document a portfolio project</strong></div></div><button className="btn-secondary" onClick={() => setActive('Skill Intelligence')}>Review skill gaps <ArrowRight size={15}/></button></div>}
          </div>
          <div className="panel side-info"><div className="side-info-icon"><FileText size={21}/></div><h3>What you'll get</h3><ul className="check-list"><li><CheckCircle2/> A clearer skills inventory</li><li><CheckCircle2/> Strengths worth highlighting</li><li><CheckCircle2/> Gaps for your target role</li><li><CheckCircle2/> Practical next steps</li></ul><div className="info-divider"/><h4>Make your resume work harder</h4><p>Include projects, tools, and outcomes. Specific evidence helps create a more useful skills profile.</p></div>
        </section>}

        {active === 'Skill Intelligence' && <section className="panel skill-page">
          <div className="panel-heading"><div><div className="section-kicker">ROLE MATCH ANALYSIS</div><h3>Your skill landscape</h3><p>Current profile compared with your target role: <strong>{role}</strong></p></div><button className="btn-secondary" onClick={() => setProfileOpen(true)}><Settings2 size={15}/> Edit target role</button></div>
          <div className="skill-summary"><div className="score-ring"><div><strong>64%</strong><span>coverage</span></div></div><div className="score-copy"><h4>A solid foundation to build on.</h4><p>Your next gains are likely to come from applied machine learning, SQL practice, and deployment experience. This score is an illustrative coverage estimate.</p><div className="skill-legend"><span><i className="legend-have"/> Current skill</span><span><i className="legend-gap"/> Target level</span></div></div></div>
          <div className="skill-bars">{roleSkills.map(s => <div className="skill-bar-row" key={s.name}><div className="skill-label"><span>{s.name}</span><small>{s.current}/{s.target} proficiency</small></div><div className="skill-track"><div className={`skill-fill ${s.color}`} style={{width:`${s.current/5*100}%`}}/><div className="target-marker" style={{left:`${s.target/5*100}%`}}/></div><span className={`gap-pill ${s.current>=s.target?'gap-good':''}`}>{s.current>=s.target?'On track':`${s.target-s.current} level gap`}</span></div>)}</div>
          <div className="priority-box"><div className="priority-icon"><Target size={18}/></div><div><strong>Your highest-impact next step</strong><p>Build a small machine-learning project and explain your evaluation choices in a clear README.</p></div><button className="text-link" onClick={() => setActive('Projects')}>Explore projects <ArrowRight size={14}/></button></div>
        </section>}

        {active === 'Career Roadmap' && <section className="panel roadmap-page">
          <div className="panel-heading"><div><div className="section-kicker">YOUR LEARNING PLAN</div><h3>The path ahead</h3><p>Built around your goal of becoming an <strong>{role}</strong>.</p></div><button className="btn-secondary" onClick={() => setProfileOpen(true)}><Settings2 size={15}/> Customize</button></div>
          <div className="roadmap-summary"><div><span>ESTIMATED PACE</span><strong>{hours}</strong></div><div><span>COMPLETION</span><strong>{progress}%</strong></div><div><span>OPEN MILESTONES</span><strong>{tasks.length-completed}</strong></div></div>
          <div className="task-toolbar"><div className="search-input"><Search size={16}/><input id="task-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your roadmap..."/></div><button className="btn-secondary" onClick={() => setNewGoal('New learning goal')}><Plus size={15}/> Add goal</button></div>
          {newGoal === 'New learning goal' && <div className="add-goal-row"><input autoFocus value="" placeholder="Type a learning goal in the field below" onChange={e => setNewGoal(e.target.value)}/><button className="icon-btn" onClick={() => setNewGoal('')}><X size={16}/></button></div>}
          {newGoal !== 'New learning goal' && <form className="add-goal-row" onSubmit={e => {e.preventDefault();addGoal();}}><input value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="Add a personal learning milestone..."/><button className="btn-primary" type="submit"><Plus size={15}/> Add</button></form>}
          <div className="roadmap-list">{filteredTasks.map((task,i) => <div className={`roadmap-task ${task.done?'task-done':''}`} key={task.id}><div className="roadmap-rail"><button className={`task-check ${task.done?'checked':''}`} onClick={() => toggleTask(task.id)} aria-label={task.done?'Mark incomplete':'Mark complete'}>{task.done?<Check size={15}/>:<span/>}</button>{i < filteredTasks.length-1 && <div className="rail-line"/>}</div><div className="roadmap-task-body"><div className="roadmap-task-meta"><span>{task.week}</span><span><Clock3 size={13}/> {task.hours} hours</span><span className="tiny-tag">{task.tag}</span></div><h4>{task.title}</h4><p>{task.detail}</p></div><button className="task-open" onClick={() => setNotice(`${task.title}: ${task.done?'Already completed.':'Work in progress — mark complete when you have finished and reviewed your work.'}`)} aria-label={`Details for ${task.title}`}><ArrowRight size={17}/></button></div>)}
          {!filteredTasks.length && <div className="empty-state"><Search size={24}/><strong>No matching tasks</strong><span>Try a different search or add a new goal.</span></div>}
          </div>
          <div className="roadmap-footer"><Lightbulb size={17}/><div><strong>Keep it realistic.</strong><span>Consistency matters more than speed. Adjust your pace when life gets busy.</span></div></div>
        </section>}

        {active === 'Projects' && <section className="projects-page">
          <div className="projects-intro"><div><div className="section-kicker">LEARN BY BUILDING</div><h3>Proof beats promises.</h3><p>Build projects that make your skills tangible to other people.</p></div><button className="btn-primary" onClick={() => {setProjects(old => [...old,{title:'Custom portfolio project',level:'PERSONALIZED',time:'4–6 hours',desc:`A starter project aligned with your goal of ${role}. Define the problem, build a small solution, and document your results.`,tags:['Your stack','Documentation','Portfolio'],icon:Lightbulb}]);setNotice('A new starter project was added.');}}><Plus size={16}/> Generate a project</button></div>
          <div className="project-grid">{projects.map((project,i) => <div className="panel project-card" key={project.title}><div className={`project-visual visual-${i%3}`}><div className="visual-grid"/><div className="project-visual-icon"><project.icon size={27}/></div><span className="visual-spark">✦</span><span className="visual-orbit"/></div><div className="project-card-body"><div className="project-meta"><span>{project.level}</span><span><Clock3 size={13}/>{project.time}</span></div><h4>{project.title}</h4><p>{project.desc}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="project-action" onClick={() => {setNewGoal(`Complete project: ${project.title}`);setActive('Career Roadmap');setNotice('Project milestone prepared. Add it to your roadmap.');}}>Add to roadmap <ArrowRight size={15}/></button></div></div>)}</div>
          <div className="project-note"><Sparkles size={17}/><span>Tip: choose a project you can finish, explain, and demonstrate. A clear README is part of the deliverable.</span></div>
        </section>}

        {active === 'Progress' && <section className="progress-page">
          <div className="stats-grid progress-stats"><StatCard label="Tasks completed" value={String(completed)} change={`of ${tasks.length} roadmap tasks`} icon={CheckCircle2} color="purple" foot="Every task counts"/><StatCard label="Current completion" value={`${progress}%`} change="Based on task check-offs" icon={Gauge} color="cyan" foot="Update as you go"/><StatCard label="Active projects" value="1" change="Portfolio in progress" icon={FolderKanban} color="blue" foot="Keep evidence of work"/><StatCard label="Weekly focus" value={hours.split(' ')[0]+'h'} change="Your study target" icon={Flame} color="pink" foot="Aim for steady habits"/></div>
          <div className="content-grid progress-content"><div className="panel growth-panel"><div className="panel-heading"><div><div className="section-kicker">SKILL DEVELOPMENT</div><h3>Your learning trajectory</h3><p>Illustrative historical skill coverage.</p></div></div><div className="growth-chart tall-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{top:12,right:8,left:-20,bottom:0}}><defs><linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5AD8DB" stopOpacity={0.25}/><stop offset="100%" stopColor="#5AD8DB" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#252d40" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill:'#77829a',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#77829a',fontSize:11}}/><Tooltip contentStyle={{background:'#151c2d',border:'1px solid #303a50',borderRadius:10}}/><Area dataKey="score" name="Skill coverage" type="monotone" stroke="#5AD8DB" strokeWidth={2.5} fill="url(#progressFill)"/></AreaChart></ResponsiveContainer></div></div><div className="panel completion-panel"><div className="section-kicker">MILESTONES</div><h3>Wins worth keeping</h3>{tasks.filter(t=>t.done).map(t=><div className="win-row" key={t.id}><div><Check size={15}/></div><span>{t.title}</span><small>Done</small></div>)}{completed===0&&<p className="muted">Complete a roadmap task to see your milestones here.</p>}<div className="completion-bottom"><Award size={20}/><div><strong>Keep collecting proof.</strong><span>Save project links, screenshots, and short reflections.</span></div></div></div></div>
          <div className="panel all-tasks-panel"><div className="panel-heading"><div><div className="section-kicker">ACTIVITY</div><h3>Task history</h3></div><button className="text-link" onClick={() => setActive('Career Roadmap')}>Manage tasks <ArrowRight size={14}/></button></div><div className="task-list">{tasks.map(t=><TaskRow key={t.id} task={t} onToggle={toggleTask}/>)}</div></div>
        </section>}

        <section className="coach-bar">
          <div className="coach-avatar"><Sparkles size={18}/></div><div className="coach-copy"><strong>Need a little direction?</strong><span>Your career copilot can help you choose the next small step.</span></div>
          <form className="coach-form" onSubmit={e=>{e.preventDefault();askCoach();}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask about your next step..." aria-label="Ask career copilot"/><button type="submit" aria-label="Send question"><ArrowRight size={17}/></button></form>
          {chatAnswer && <div className="coach-answer"><div><Sparkles size={15}/><strong>Career copilot</strong></div><p>{chatAnswer}</p><button onClick={()=>setChatAnswer('')} aria-label="Dismiss answer"><X size={14}/></button></div>}
        </section>
        <footer className="footer"><span>© 2026 SkillPilot AI</span><span><i/> Built for your next chapter</span><button onClick={() => setNotice('SkillPilot AI demo: career insights are illustrative and not a hiring guarantee.')}><CircleHelp size={14}/> About this demo</button></footer>
      </div>
    </main>
  </div>;
}

function StatCard({label,value,change,icon:Icon,color,foot}:{label:string;value:string;change:string;icon:any;color:string;foot:string}) {
  return <div className="panel stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${color}`}><Icon size={17}/></div></div><div className="stat-value">{value}</div><div className="stat-change"><span><TrendingUp size={13}/></span>{change}</div><div className="stat-foot">{foot}</div></div>;
}
function TaskRow({task,onToggle}:{task:Task;onToggle:(id:number)=>void}) {
  return <div className={`task-row ${task.done?'row-done':''}`}><button className={`task-check ${task.done?'checked':''}`} onClick={()=>onToggle(task.id)} aria-label={task.done?'Mark incomplete':'Mark complete'}>{task.done?<Check size={14}/>:<span/>}</button><div className="task-row-copy"><strong>{task.title}</strong><span>{task.detail}</span></div><span className="task-row-week">{task.week}</span><span className="task-row-hours"><Clock3 size={13}/>{task.hours}h</span><button className="task-open" onClick={()=>onToggle(task.id)} aria-label="Toggle task"><ArrowRight size={16}/></button></div>;
}
