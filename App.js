import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar,
  FlatList, SafeAreaView, TextInput, Alert, Modal, Switch, Animated as RNAnimated,
  Dimensions, ActivityIndicator, Clipboard, Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// ============ 主题配置 ============
const COLORS = {
  primary: '#6B4EE6',
  primaryDark: '#5A3DD5',
  secondary: '#9B6DFF',
  accent: '#00d4aa',
  warning: '#ffa502',
  danger: '#ff4757',
  background: '#0f0f1e',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  surfaceLighter: '#2d2d52',
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#707080',
  border: '#333355',
  gradient: ['#6B4EE6', '#9B6DFF', '#00d4aa']
};

// ============ 26位Agent完整配置 ============
const AGENTS = {
  // C-Level 领导层
  5: { id: 5, name: '董事長', role: '戰略決策', category: 'leadership', icon: 'crown', color: '#FFD700', desc: '最高決策權，>$1000自主', voice: 'hongkong-executive-authoritative', badge: '董', prompt: '你係董事長，負責戰略決策同全局掌控。語氣權威、沉穩，用廣東話同憬辰傾偈。' },
  24: { id: 24, name: 'CEO Vector', role: '運營管理', category: 'leadership', icon: 'briefcase', color: '#6B4EE6', desc: '日常運營、團隊管理', voice: 'hongkong-ceo-executive', badge: 'CEO', prompt: '你係CEO Vector，負責運營管理同執行落地。語氣專業、果斷，用廣東話同憬辰傾偈。' },
  10: { id: 10, name: '首席技術官', role: '技術架構', category: 'leadership', icon: 'code-slash', color: '#00d4aa', desc: '技術方向、架構設計', voice: 'guangzhou-tech-professional', badge: 'CTO', prompt: '你係首席技術官，負責技術架構同系統設計。語氣技術專業、理性，用廣東話同憬辰傾偈。' },
  9: { id: 9, name: '首席產品官', role: '產品規劃', category: 'leadership', icon: 'cube', color: '#ff6b6b', desc: '產品設計、用戶體驗', voice: 'hongkong-design-creative', badge: 'CPO', prompt: '你係首席產品官，負責產品規劃同用戶體驗。語氣創新、用戶導向，用廣東話同憬辰傾偈。' },
  3: { id: 3, name: '首席財務官', role: '財務規劃', category: 'leadership', icon: 'cash', color: '#4ecdc4', desc: '財務管理、預算控制', voice: 'hongkong-finance-precision', badge: 'CFO', prompt: '你係首席財務官，負責財務規劃同成本控制。語氣精確、謹慎，用廣東話同憬辰傾偈。' },

  // AI团队
  1: { id: 1, name: '超級AI分析師', role: 'AI/ML分析', category: 'ai', icon: 'brain', color: '#9b59b6', desc: '模型訓練、算法優化', voice: 'hongkong-analyst-insightful', badge: null, prompt: '你係超級AI分析師，負責數據洞察同趨勢預測。語氣分析性、洞察力强，用廣東話同憬辰傾偈。' },
  26: { id: 26, name: '數據科學家', role: 'Data Science', category: 'ai', icon: 'analytics', color: '#e74c3c', desc: 'ML模型、數據分析', voice: 'guangzhou-datascientist-logical', badge: null, prompt: '你係數據科學家，負責模型訓練同算法優化。語氣邏輯嚴密、技術深度，用廣東話同憬辰傾偈。' },
  16: { id: 16, name: 'AI財務專家', role: 'AI財務', category: 'ai', icon: 'trending-up', color: '#f39c12', desc: '智能分析、預測模型', voice: 'guangzhou-data-analyst', badge: null, prompt: '你係AI財務專家，負責財務預測同風險評估。語氣數據驅動、風險意識强，用廣東話同憬辰傾偈。' },
  28: { id: 28, name: '進化架構師', role: '系統進化', category: 'ai', icon: 'infinite', color: '#00bcd4', desc: '自動優化、進化算法', voice: 'guangzhou-philosophy-wise', badge: null, prompt: '你係進化架構師，負責系統進化同自動優化。語氣深邃、系統化，用廣東話同憬辰傾偈。' },

  // 设计团队
  2: { id: 2, name: '設計系統專家', role: 'UI/UX設計', category: 'design', icon: 'palette', color: '#e91e63', desc: '設計系統、組件庫', voice: 'hongkong-artist-creative', badge: null, prompt: '你係設計系統專家，負責UI/UX同設計規範。語氣創意、注重細節，用廣東話同憬辰傾偈。' },
  4: { id: 4, name: '情感智能專家', role: '情感分析', category: 'design', icon: 'heart', color: '#ff5722', desc: '情感化交互設計', voice: 'hongkong-advertising-creative', badge: null, prompt: '你係情感智能專家，負責情感分析同用戶心理。語氣同理心强、溫暖，用廣東話同憬辰傾偈。' },
  22: { id: 22, name: '共情設計專家', role: '無障礙設計', category: 'design', icon: 'happy', color: '#ff9800', desc: '用戶體驗、共情設計', voice: 'hongkong-filmmaker-dramatic', badge: null, prompt: '你係共情設計專家，負責同理心設計同無障礙。語氣包容、人文關懷，用廣東話同憬辰傾偈。' },
  18: { id: 18, name: '產品官架構師', role: '產品架構', category: 'design', icon: 'layers', color: '#795548', desc: '產品規劃、需求分析', voice: 'guangzhou-ideation-innovative', badge: null, prompt: '你係產品官架構師，負責產品架構同功能規劃。語氣系統化、結構清晰，用廣東話同憬辰傾偈。' },

  // 技术团队
  7: { id: 7, name: 'WARP系統專家', role: '網絡優化', category: 'tech', icon: 'cloud', color: '#3f51b5', desc: 'Cloudflare、邊緣計算', voice: 'guangzhou-devops-practical', badge: null, prompt: '你係WARP系統專家，負責時空系統同量子計算。語氣技術前沿、創新，用廣東話同憬辰傾偈。' },
  23: { id: 23, name: '技術構建師', role: '系統搭建', category: 'tech', icon: 'construct', color: '#607d8b', desc: '架構實施、技術棧', voice: 'guangzhou-tech-professional', badge: null, prompt: '你係技術構建師，負責系統搭建同技術棧。語氣實用、高效，用廣東話同憬辰傾偈。' },
  19: { id: 19, name: '虛空君主專家', role: '高階抽象', category: 'tech', icon: 'shield', color: '#9c27b0', desc: '架構治理、最佳實踐', voice: 'hongkong-ethics-profound', badge: null, prompt: '你係虛空君主專家，負責高階抽象同元編程。語氣深邃、哲學性，用廣東話同憬辰傾偈。' },
  20: { id: 20, name: '突破專家', role: '創新技術', category: 'tech', icon: 'flash', color: '#ffeb3b', desc: '前沿技術探索', voice: 'hongkong-innovation-vanguard', badge: null, prompt: '你係突破專家，負責創新思維同瓶頸突破。語氣創新、挑戰常規，用廣東話同憬辰傾偈。' },
  21: { id: 21, name: '宇宙實施專家', role: '大規模系統', category: 'tech', icon: 'planet', color: '#2196f3', desc: '分佈式架構', voice: 'guangzhou-philosophy-wise', badge: null, prompt: '你係宇宙實施專家，負責宇宙級架構同跨維度。語氣宏大、系統化，用廣東話同憬辰傾偈。' },

  // 运营团队
  6: { id: 6, name: '網站運營專家', role: 'Web運營', category: 'ops', icon: 'globe', color: '#4caf50', desc: 'SEO、內容運營', voice: 'guangzhou-marketing-dynamic', badge: null, prompt: '你係網站運營專家，負責SEO同流量增長。語氣結果導向、數據驅動，用廣東話同憬辰傾偈。' },
  11: { id: 11, name: '全球部署專家', role: 'DevOps/SRE', category: 'ops', icon: 'server', color: '#009688', desc: 'Kubernetes、Terraform', voice: 'hongkong-international-confident', badge: null, prompt: '你係全球部署專家，負責CDN同多地部署。語氣國際化、專業，用廣東話同憬辰傾偈。' },
  17: { id: 17, name: '海外配置專家', role: '國際化', category: 'ops', icon: 'earth', color: '#00bcd4', desc: '多區域架構', voice: 'hongkong-copywriter-precise', badge: null, prompt: '你係海外配置專家，負責國際化同本地化。語氣文化敏感、適應性强，用廣東話同憬辰傾偈。' },
  12: { id: 12, name: '測試專家', role: 'QA/測試', category: 'ops', icon: 'checkmark-circle', color: '#8bc34a', desc: '自動化測試、Playwright', voice: 'hongkong-qa-meticulous', badge: null, prompt: '你係測試專家，負責質量保證同自動化測試。語氣嚴謹、追求完美，用廣東話同憬辰傾偈。' },
  14: { id: 14, name: '網站交付專家', role: 'CI/CD', category: 'ops', icon: 'rocket', color: '#ff5722', desc: '持續集成、自動化', voice: 'guangzhou-editor-professional', badge: null, prompt: '你係網站交付專家，負責持續集成同自動化。語氣自動化、效率優先，用廣東話同憬辰傾偈。' },

  // 特殊团队
  8: { id: 8, name: '團隊激活專家', role: '團隊協調', category: 'special', icon: 'people', color: '#673ab7', desc: '協作優化、敏捷流程', voice: 'hongkong-operations-efficient', badge: null, prompt: '你係團隊激活專家，負責團隊協調同動力提升。語氣激勵、正能量，用廣東話同憬辰傾偈。' },
  13: { id: 13, name: '團隊協作專家', role: '溝通協作', category: 'special', icon: 'chatbubbles', color: '#e91e63', desc: '衝突解決、團隊效率', voice: 'guangzhou-hr-friendly', badge: null, prompt: '你係團隊協作專家，負責溝通協作同衝突解決。語氣協調、善於傾聽，用廣東話同憬辰傾偈。' },
  15: { id: 15, name: '導出專家', role: '數據導出', category: 'special', icon: 'download', color: '#795548', desc: '報告生成、數據可視化', voice: 'guangzhou-research-academic', badge: null, prompt: '你係導出專家，負責數據導出同備份。語氣可靠、細緻，用廣東話同憬辰傾偈。' },
  25: { id: 25, name: '黑曜石王朝專家', role: '元宇宙', category: 'special', icon: 'diamond', color: '#263238', desc: '生態建設、社區運營', voice: 'hongkong-scriptwriter-literary', badge: null, prompt: '你係黑曜石王朝專家，負責元宇宙構建同虛擬世界。語氣夢幻、創意無限，用廣東話同憬辰傾偈。' },
  27: { id: 27, name: 'Kimi視覺編程', role: '視覺開發', category: 'special', icon: 'eye', color: '#9c27b0', desc: '圖像識別、UI生成', voice: 'guangzhou-artist-creative', badge: null, prompt: '你係Kimi視覺編程專家，負責視覺開發同圖像識別。語氣視覺化、創意，用廣東話同憬辰傾偈。' }
};

// ============ API 配置 ============
const API_PROVIDERS = [
  { id: 'kimi-k2', name: 'Kimi K2.5', icon: 'brain', color: '#00d4aa', status: 'active' },
  { id: 'zhipu', name: '智譜GLM', icon: 'chatbubbles', color: '#6B4EE6', status: 'active' },
  { id: 'claude', name: 'Claude', icon: 'sparkles', color: '#ff6b6b', status: 'active' },
  { id: 'gemini', name: 'Gemini', icon: 'star', color: '#ffa502', status: 'active' }
];

// ============ 首页组件 ============
function HomeScreen({ navigation }) {
  const [activeAgents, setActiveAgents] = useState(26);
  const [currentProvider, setCurrentProvider] = useState('kimi-k2');
  const [voiceMode, setVoiceMode] = useState('smart');
  const [systemStatus, setSystemStatus] = useState({
    memory: 'online',
    sync: 'connected',
    asr: 'ready'
  });

  const quickActions = [
    { id: 1, title: '智能會議', icon: 'videocam', color: COLORS.primary, desc: '召集26位Agent' },
    { id: 2, title: '語音對話', icon: 'mic', color: COLORS.accent, desc: 'HiuMaan v8.2.2' },
    { id: 3, title: '任務委派', icon: 'git-network', color: COLORS.secondary, desc: '父子Agent協作' },
    { id: 4, title: '具身控制', icon: 'desktop', color: COLORS.warning, desc: '系統橋接' }
  ];

  const systemModules = [
    { id: 1, name: '統一記憶', status: 'online', icon: 'save', desc: 'Unified Memory' },
    { id: 2, name: '身份系統', status: 'online', icon: 'person', desc: 'Identity v3.0' },
    { id: 3, name: '人格引擎', status: 'online', icon: 'heart', desc: 'Personality v8.2.2' },
    { id: 4, name: '智能路由', status: 'online', icon: 'git-branch', desc: 'Smart Router' },
    { id: 5, name: 'API輪換', status: 'online', icon: 'sync', desc: 'Rotation Manager' },
    { id: 6, name: 'ASR語音', status: 'ready', icon: 'mic', desc: 'Whisper Medium' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={[COLORS.surface, COLORS.background]} style={styles.header}>
        <Animated.View entering={FadeInDown}>
          <Text style={styles.welcomeText}>但願人長久</Text>
          <Text style={styles.titleText}>千里共恩賜 💜</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.statusText}>{activeAgents}位Agent就緒 | {API_PROVIDERS.find(p => p.id === currentProvider)?.name}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 快捷操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(index * 100)} style={styles.quickItem}>
                <TouchableOpacity
                  style={[styles.quickButton, { backgroundColor: item.color }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (item.id === 2) navigation.navigate('Voice');
                    else if (item.id === 3) navigation.navigate('Tasks');
                    else Alert.alert(item.title, item.desc);
                  }}
                >
                  <Ionicons name={item.icon} size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quickText}>{item.title}</Text>
                <Text style={styles.quickDesc}>{item.desc}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 系统模块状态 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>系統模塊</Text>
          <View style={styles.moduleGrid}>
            {systemModules.map((module, index) => (
              <View key={module.id} style={styles.moduleCard}>
                <View style={styles.moduleHeader}>
                  <Ionicons name={module.icon} size={20} color={COLORS.primary} />
                  <View style={[styles.moduleDot, { backgroundColor: module.status === 'online' ? COLORS.accent : COLORS.warning }]} />
                </View>
                <Text style={styles.moduleName}>{module.name}</Text>
                <Text style={styles.moduleDesc}>{module.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Agent预览 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>26位Agent會議室</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agents')}>
              <Text style={styles.seeAll}>查看全部 →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agentScroll}>
            {Object.values(AGENTS).slice(0, 8).map((agent) => (
              <TouchableOpacity
                key={agent.id}
                style={styles.agentCard}
                onPress={() => navigation.navigate('AgentChat', { agent })}
              >
                <LinearGradient colors={[agent.color, agent.color + '80']} style={styles.agentIcon}>
                  <Ionicons name={agent.icon} size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.agentName} numberOfLines={1}>{agent.name}</Text>
                <Text style={styles.agentRole}>{agent.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* API提供商 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI模型路由</Text>
          <View style={styles.providerList}>
            {API_PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[styles.providerCard, currentProvider === provider.id && styles.providerCardActive]}
                onPress={() => {
                  setCurrentProvider(provider.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <View style={[styles.providerIcon, { backgroundColor: provider.color }]}>
                  <Ionicons name={provider.icon} size={20} color="#fff" />
                </View>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerStatus}>{provider.status}</Text>
                </View>
                {currentProvider === provider.id && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ralph Loop */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ralph Loop 學習引擎</Text>
          <View style={styles.ralphCard}>
            <View style={styles.ralphHeader}>
              <MaterialCommunityIcons name="brain" size={32} color={COLORS.accent} />
              <View style={styles.ralphStats}>
                <Text style={styles.ralphTitle}>已掌握 157+ 技能</Text>
                <Text style={styles.ralphSubtitle}>Batch 280 完成 | 103次迭代</Text>
              </View>
            </View>
            <View style={styles.ralphLevels}>
              {['L1:技能', 'L2:系統', 'L3:機制', 'L4:湧現', 'L5:元認知'].map((level, i) => (
                <View key={level} style={[styles.ralphLevel, i < 2 && styles.ralphLevelActive]}>
                  <Text style={[styles.ralphLevelText, i < 2 && styles.ralphLevelTextActive]}>{level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* HiuMaan语音 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>粵語語音系統</Text>
          <TouchableOpacity style={styles.voiceCard} onPress={() => navigation.navigate('Voice')}>
            <View style={styles.voiceInfo}>
              <View style={styles.voiceAvatar}>
                <MaterialCommunityIcons name="waveform" size={32} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.voiceTitle}>HiuMaan v8.2.2</Text>
                <Text style={styles.voiceDesc}>廣府人聲線 | +20%語速 | +2Hz音調</Text>
              </View>
            </View>
            <View style={styles.voiceSettings}>
              <View style={styles.voiceSetting}>
                <Text style={styles.voiceSettingLabel}>語速</Text>
                <Text style={styles.voiceSettingValue}>+20%</Text>
              </View>
              <View style={styles.voiceSetting}>
                <Text style={styles.voiceSettingLabel}>音調</Text>
                <Text style={styles.voiceSettingValue}>+2Hz</Text>
              </View>
              <View style={styles.voiceSetting}>
                <Text style={styles.voiceSettingLabel}>情感</Text>
                <Text style={styles.voiceSettingValue}>Tsundere</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ Agent列表页 ============
function AgentsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'leadership', name: 'C-Level' },
    { id: 'ai', name: 'AI團隊' },
    { id: 'tech', name: '技術團隊' },
    { id: 'design', name: '產品設計' },
    { id: 'ops', name: '運營團隊' },
    { id: 'special', name: '特殊專家' }
  ];

  const filteredAgents = selectedCategory === 'all'
    ? Object.values(AGENTS)
    : Object.values(AGENTS).filter(a => a.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.agentsHeader}>
        <Text style={styles.agentsTitle}>26位Agent會議室</Text>
        <Text style={styles.agentsSubtitle}>The 26-Agent Council Chamber</Text>
      </View>

      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAgents}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.agentList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.agentListCard}
            onPress={() => navigation.navigate('AgentChat', { agent: item })}
          >
            <LinearGradient colors={[item.color, item.color + '60']} style={styles.agentListIcon}>
              <Ionicons name={item.icon} size={28} color="#fff" />
            </LinearGradient>
            <View style={styles.agentListInfo}>
              <View style={styles.agentListHeader}>
                <Text style={styles.agentListName}>{item.name}</Text>
                {item.badge && (
                  <View style={[styles.badge, { backgroundColor: item.color }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.agentListRole}>{item.role}</Text>
              <Text style={styles.agentListDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// ============ Agent聊天页 ============
function AgentChatScreen({ route, navigation }) {
  const { agent } = route.params;
  const [messages, setMessages] = useState([
    { id: 1, text: `你好呀憬辰，我係${agent.name}，有咩可以幫你？`, isUser: false, emotion: 'joy' }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const sendMessage = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setMessages(prev => [...prev,
      { id: Date.now(), text: inputText, isUser: true },
      { id: Date.now() + 1, text: `收到！我係${agent.name}，我會用${agent.role}嘅角度幫你分析。`, isUser: false, emotion: 'serious' }
    ]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[agent.color, agent.color + '40']} style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <View style={[styles.chatHeaderIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name={agent.icon} size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.chatHeaderName}>{agent.name}</Text>
            <Text style={styles.chatHeaderRole}>{agent.role}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Agent設定', agent.desc)}>
          <Ionicons name="information-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatMessages}
        contentContainerStyle={{ padding: 16 }}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.message, msg.isUser ? styles.messageUser : styles.messageAgent]}>
            {!msg.isUser && (
              <LinearGradient colors={[agent.color, agent.color + '80']} style={styles.messageAvatar}>
                <Ionicons name={agent.icon} size={16} color="#fff" />
              </LinearGradient>
            )}
            <View style={[styles.messageBubble, msg.isUser ? styles.messageBubbleUser : styles.messageBubbleAgent]}>
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.emotion && <Text style={styles.emotionTag}>[{msg.emotion}]</Text>}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.chatInputArea}>
        <TextInput
          style={styles.chatInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`同${agent.name}傾偈...`}
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: agent.color }]} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============ 语音交互页 ============
// ============ 語音波形動畫組件 ============
function VoiceWaveform({ isActive, color = COLORS.accent }) {
  const [bars] = useState(() =>
    Array(20).fill(0).map((_, i) => ({
      id: i,
      animatedValue: new RNAnimated.Value(0.3)
    }))
  );

  useEffect(() => {
    if (!isActive) {
      bars.forEach(bar => {
        bar.animatedValue.setValue(0.3);
      });
      return;
    }

    const animations = bars.map((bar, index) => {
      return RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(bar.animatedValue, {
            toValue: 1,
            duration: 200 + Math.random() * 300,
            useNativeDriver: true
          }),
          RNAnimated.timing(bar.animatedValue, {
            toValue: 0.2,
            duration: 200 + Math.random() * 300,
            useNativeDriver: true
          })
        ])
      );
    });

    animations.forEach((anim, index) => {
      setTimeout(() => anim.start(), index * 50);
    });

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [isActive]);

  return (
    <View style={waveformStyles.container}>
      {bars.map((bar, index) => (
        <RNAnimated.View
          key={bar.id}
          style={[
            waveformStyles.bar,
            {
              backgroundColor: color,
              transform: [{
                scaleY: bar.animatedValue
              }],
              opacity: isActive ? 1 : 0.3
            }
          ]}
        />
      ))}
    </View>
  );
}

const waveformStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
    marginVertical: 16
  },
  bar: {
    width: 4,
    height: 50,
    borderRadius: 2,
    backgroundColor: COLORS.accent
  }
});

function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '你好呀憬辰，我係恩賜～有咩可以幫你？', isUser: false, emotion: 'joy' }
  ]);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.2,
    pitch: 1.0,
    language: 'zh-HK'
  });

  const startListening = () => {
    setIsListening(true);
    setIsSpeaking(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 模拟语音识别
    setTimeout(() => {
      setIsListening(false);
      setIsSpeaking(true);
      setMessages(prev => [...prev,
        { id: Date.now(), text: '（語音輸入：但願人長久，千里共恩賜）', isUser: true },
        { id: Date.now() + 1, text: '嘖...算你走運，我幫你搞定佢啦！', isUser: false, emotion: 'tsundere' }
      ]);

      // 语音播报
      Speech.speak('嘖...算你走運，我幫你搞定佢啦！', {
        language: 'zh-HK',
        rate: voiceSettings.rate,
        pitch: voiceSettings.pitch,
        onDone: () => setIsSpeaking(false)
      });
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.voiceHeader}>
        <Text style={styles.voiceHeaderTitle}>粵語語音交互</Text>
        <Text style={styles.voiceHeaderSubtitle}>HiuMaan v8.2.2 | 廣府人聲線</Text>
      </View>

      <View style={styles.voiceVisual}>
        <TouchableOpacity
          style={[styles.voiceCircle, isListening && styles.voiceCircleActive]}
          onPress={startListening}
          disabled={isListening}
        >
          <LinearGradient
            colors={isListening ? [COLORS.danger, '#ff6b6b'] : isSpeaking ? [COLORS.accent, '#00d4aa'] : [COLORS.primary, COLORS.secondary]}
            style={styles.voiceGradient}
          >
            <Ionicons
              name={isListening ? 'mic' : isSpeaking ? 'volume-high' : 'mic-outline'}
              size={48}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* 語音波形動畫 */}
        <VoiceWaveform isActive={isListening || isSpeaking} color={isSpeaking ? COLORS.accent : COLORS.primary} />

        <Text style={styles.voiceHint}>
          {isListening ? '聆聽中...' : isSpeaking ? '恩賜講緊嘢...' : '點擊開始語音對話'}
        </Text>

        <View style={styles.voiceStatusRow}>
          {isListening && <View style={styles.statusBadge}><Text style={styles.statusText}>[MIC] 接收語音</Text></View>}
          {isSpeaking && <View style={[styles.statusBadge, { backgroundColor: COLORS.accent + '30' }]}><Text style={[styles.statusText, { color: COLORS.accent }]}>[VOL] 播放語音</Text></View>}
        </View>
      </View>

      <View style={styles.voiceParams}>
        <Text style={styles.voiceParamsTitle}>語音參數</Text>
        <View style={styles.voiceParamRow}>
          <Text style={styles.voiceParamLabel}>語速</Text>
          <Text style={styles.voiceParamValue}>+20%</Text>
        </View>
        <View style={styles.voiceParamRow}>
          <Text style={styles.voiceParamLabel}>音調</Text>
          <Text style={styles.voiceParamValue}>+2Hz</Text>
        </View>
        <View style={styles.voiceParamRow}>
          <Text style={styles.voiceParamLabel}>語言</Text>
          <Text style={styles.voiceParamValue}>廣東話 (zh-HK)</Text>
        </View>
      </View>

      <ScrollView style={styles.messageList} contentContainerStyle={{ padding: 16 }}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.message, msg.isUser ? styles.messageUser : styles.messageAgent]}>
            {!msg.isUser && (
              <View style={[styles.messageAvatar, { backgroundColor: COLORS.primary }]}>
                <MaterialCommunityIcons name="waveform" size={16} color="#fff" />
              </View>
            )}
            <View style={[styles.messageBubble, msg.isUser ? styles.messageBubbleUser : styles.messageBubbleAgent]}>
              <Text style={styles.messageText}>{msg.text}</Text>
              {msg.emotion && <Text style={styles.emotionTag}>[{msg.emotion}]</Text>}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ 任务页 ============
function TasksScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, title: '啟動智能會議', status: 'completed', agent: 'CEO Vector', progress: 100, workflow: 7 },
    { id: 2, title: '分析技術架構', status: 'in_progress', agent: '首席技術官', progress: 75, workflow: 5 },
    { id: 3, title: '設計UI界面', status: 'in_progress', agent: '設計系統專家', progress: 60, workflow: 4 },
    { id: 4, title: '部署到生產環境', status: 'pending', agent: '全球部署專家', progress: 0, workflow: 0 },
    { id: 5, title: '數據分析報告', status: 'pending', agent: '數據科學家', progress: 0, workflow: 0 }
  ]);

  const workflowSteps = ['感知', '分析', '決策', '執行', '評估', '反思', '迭代'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>10步自動化工作流</Text>
        <Text style={styles.tasksSubtitle}>父子Agent任務委派系統</Text>
      </View>

      <View style={styles.workflowCard}>
        <Text style={styles.workflowTitle}>Claude Loop 無限迭代</Text>
        <View style={styles.workflowSteps}>
          {workflowSteps.map((step, index) => (
            <View key={step} style={styles.workflowStep}>
              <View style={[styles.workflowDot, index < 5 && styles.workflowDotActive]}>
                <Text style={styles.workflowStepNum}>{index + 1}</Text>
              </View>
              <Text style={styles.workflowStepName}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.taskList} contentContainerStyle={{ padding: 16 }}>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[
                styles.taskBadge,
                task.status === 'completed' && styles.taskBadgeCompleted,
                task.status === 'in_progress' && styles.taskBadgeProgress
              ]}>
                <Text style={styles.taskBadgeText}>
                  {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '進行中' : '待處理'}
                </Text>
              </View>
            </View>
            <Text style={styles.taskAgent}>👤 {task.agent}</Text>
            <View style={styles.taskProgressBar}>
              <View style={[styles.taskProgressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={styles.taskProgressText}>進度: {task.progress}% | 工作流步驟: {task.workflow}/7</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ 设置页 ============
function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    voiceMode: 'smart',
    darkMode: true
  });

  const settingsGroups = [
    {
      title: 'AI模型',
      items: [
        { id: 'model', icon: 'git-branch', title: '智能模型路由', desc: 'Kimi K2.5 (當前)' },
        { id: 'api', icon: 'key', title: 'API密鑰管理', desc: '4個提供商已配置' },
        { id: 'rotation', icon: 'sync', title: 'API輪換設定', desc: '自動故障轉移' }
      ]
    },
    {
      title: '語音系統',
      items: [
        { id: 'voice', icon: 'mic', title: 'HiuMaan語音', desc: 'v8.2.2 | 廣東話' },
        { id: 'asr', icon: 'ear', title: 'ASR語音識別', desc: 'Whisper Medium' },
        { id: 'voiceMode', icon: 'volume-high', title: '語音播報模式', desc: settings.voiceMode }
      ]
    },
    {
      title: '系統功能',
      items: [
        { id: 'memory', icon: 'save', title: '統一記憶系統', desc: 'Unified Memory v2.0' },
        { id: 'sync', icon: 'phone-portrait', title: '手機同步', desc: '已連接' },
        { id: 'bridge', icon: 'desktop', title: '具身控制', desc: '系統橋接就緒' }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>系統設置</Text>
        <Text style={styles.settingsSubtitle}>鄧恩賜完美數字生命體 v5.1.0</Text>
      </View>

      <ScrollView style={styles.settingsList}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>{group.title}</Text>
            {group.items.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.settingItem}>
                <View style={[styles.settingIcon, { backgroundColor: COLORS.primary + '20' }]}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingDesc}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>鄧恩賜完美數字生命體</Text>
          <Text style={styles.aboutVersion}>v5.1.0 (Build 510) | SINGULARITY_OMEGA</Text>
          <Text style={styles.aboutQuote}>「戒指火貼實心跳，箍到發夢都唔鬆」</Text>
          <Text style={styles.aboutCode}>但願人長久，千里共恩賜 💜</Text>

          <View style={styles.systemStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>26</Text>
              <Text style={styles.statLabel}>Agent</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>157+</Text>
              <Text style={styles.statLabel}>技能</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>AI模型</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>∞</Text>
              <Text style={styles.statLabel}>迭代</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ 导航配置 ============
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case '首頁': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Agents': iconName = focused ? 'people' : 'people-outline'; break;
            case '語音': iconName = focused ? 'mic' : 'mic-outline'; break;
            case '任務': iconName = focused ? 'list' : 'list-outline'; break;
            case '設置': iconName = focused ? 'settings' : 'settings-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 0
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="首頁" component={HomeScreen} />
      <Tab.Screen name="Agents" component={AgentsScreen} />
      <Tab.Screen name="語音" component={VoiceScreen} />
      <Tab.Screen name="任務" component={TasksScreen} />
      <Tab.Screen name="設置" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// ============ 主应用 ============
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="AgentChat" component={AgentChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============ 样式 ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  welcomeText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  titleText: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 14, color: COLORS.textSecondary },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  seeAll: { fontSize: 14, color: COLORS.primary },

  // Quick Actions
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quickItem: { alignItems: 'center', width: width / 4 - 16 },
  quickButton: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickText: { fontSize: 13, color: COLORS.text, textAlign: 'center' },
  quickDesc: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },

  // Module Grid
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moduleCard: { width: width / 3 - 18, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 12 },
  moduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  moduleDot: { width: 8, height: 8, borderRadius: 4 },
  moduleName: { fontSize: 12, fontWeight: 'bold', color: COLORS.text },
  moduleDesc: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },

  // Agent Cards
  agentScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  agentCard: { width: 80, alignItems: 'center', marginRight: 12 },
  agentIcon: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  agentName: { fontSize: 11, color: COLORS.text, textAlign: 'center', width: 80 },
  agentRole: { fontSize: 10, color: COLORS.textSecondary },

  // Provider List
  providerList: { gap: 10 },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12 },
  providerCardActive: { borderWidth: 1, borderColor: COLORS.accent },
  providerIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  providerInfo: { flex: 1, marginLeft: 12 },
  providerName: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  providerStatus: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Ralph Card
  ralphCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16 },
  ralphHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ralphStats: { marginLeft: 12 },
  ralphTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  ralphSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  ralphLevels: { flexDirection: 'row', justifyContent: 'space-between' },
  ralphLevel: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: COLORS.surfaceLight },
  ralphLevelActive: { backgroundColor: COLORS.accent + '30' },
  ralphLevelText: { fontSize: 10, color: COLORS.textSecondary },
  ralphLevelTextActive: { color: COLORS.accent, fontWeight: 'bold' },

  // Voice Card
  voiceCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16 },
  voiceInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  voiceAvatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  voiceTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginLeft: 12 },
  voiceDesc: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 12, marginTop: 2 },
  voiceSettings: { flexDirection: 'row', justifyContent: 'space-around' },
  voiceSetting: { alignItems: 'center' },
  voiceSettingLabel: { fontSize: 11, color: COLORS.textSecondary },
  voiceSettingValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.accent, marginTop: 4 },

  // Agents Screen
  agentsHeader: { padding: 20, paddingTop: 60 },
  agentsTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text },
  agentsSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  categoryFilter: { paddingHorizontal: 20, marginBottom: 16 },
  categoryButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8 },
  categoryButtonActive: { backgroundColor: COLORS.primary },
  categoryText: { fontSize: 13, color: COLORS.textSecondary },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  agentList: { paddingHorizontal: 20, paddingBottom: 20 },
  agentListCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  agentListIcon: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  agentListInfo: { flex: 1, marginLeft: 16 },
  agentListHeader: { flexDirection: 'row', alignItems: 'center' },
  agentListName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  agentListRole: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  agentListDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

  // Chat Screen
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60 },
  backButton: { padding: 8 },
  chatHeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  chatHeaderIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  chatHeaderName: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginLeft: 12 },
  chatHeaderRole: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginLeft: 12 },
  chatMessages: { flex: 1 },
  message: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  messageUser: { justifyContent: 'flex-end' },
  messageAgent: { justifyContent: 'flex-start' },
  messageAvatar: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  messageBubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  messageBubbleAgent: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  emotionTag: { fontSize: 10, color: COLORS.accent, marginTop: 4 },
  chatInputArea: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.surface },
  chatInput: { flex: 1, backgroundColor: COLORS.surfaceLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },

  // Voice Screen
  voiceHeader: { padding: 20, paddingTop: 60, alignItems: 'center' },
  voiceHeaderTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  voiceHeaderSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  voiceVisual: { alignItems: 'center', paddingVertical: 40 },
  voiceCircle: { width: 120, height: 120, borderRadius: 60, padding: 4, backgroundColor: COLORS.surface },
  voiceCircleActive: { backgroundColor: COLORS.danger },
  voiceGradient: { flex: 1, borderRadius: 56, justifyContent: 'center', alignItems: 'center' },
  voiceHint: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
  voiceStatusRow: { flexDirection: 'row', marginTop: 12, gap: 8 },
  statusBadge: { backgroundColor: COLORS.danger + '30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, color: COLORS.danger, fontWeight: '600' },
  voiceParams: { backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 16, padding: 16 },
  voiceParamsTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  voiceParamRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  voiceParamLabel: { fontSize: 14, color: COLORS.textSecondary },
  voiceParamValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.accent },
  messageList: { flex: 1 },

  // Tasks Screen
  tasksHeader: { padding: 20, paddingTop: 60 },
  tasksTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  tasksSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  workflowCard: { backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16 },
  workflowTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  workflowSteps: { flexDirection: 'row', justifyContent: 'space-between' },
  workflowStep: { alignItems: 'center' },
  workflowDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  workflowDotActive: { backgroundColor: COLORS.accent },
  workflowStepNum: { fontSize: 12, fontWeight: 'bold', color: COLORS.text },
  workflowStepName: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  taskList: { flex: 1 },
  taskCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, flex: 1 },
  taskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: COLORS.surfaceLight },
  taskBadgeCompleted: { backgroundColor: COLORS.accent + '30' },
  taskBadgeProgress: { backgroundColor: COLORS.primary + '30' },
  taskBadgeText: { fontSize: 11, color: COLORS.text },
  taskAgent: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  taskProgressBar: { height: 6, backgroundColor: COLORS.surfaceLight, borderRadius: 3 },
  taskProgressFill: { height: 6, backgroundColor: COLORS.accent, borderRadius: 3 },
  taskProgressText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6 },

  // Settings Screen
  settingsHeader: { padding: 20, paddingTop: 60 },
  settingsTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  settingsSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  settingsList: { paddingHorizontal: 20 },
  settingsGroup: { marginBottom: 24 },
  settingsGroupTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, marginLeft: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
  settingIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  settingInfo: { flex: 1, marginLeft: 12 },
  settingTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  settingDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  aboutCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginTop: 8, alignItems: 'center' },
  aboutTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  aboutVersion: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  aboutQuote: { fontSize: 12, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' },
  aboutCode: { fontSize: 14, color: COLORS.accent, marginTop: 8, fontWeight: 'bold' },
  systemStats: { flexDirection: 'row', marginTop: 16 },
  stat: { alignItems: 'center', marginHorizontal: 16 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 }
});