import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// 主题色彩
const COLORS = {
  primary: '#6B4EE6',
  secondary: '#9B6DFF',
  background: '#0f0f1e',
  surface: '#1a1a2e',
  surfaceLight: '#252542',
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  accent: '#00d4aa',
  danger: '#ff4757',
  warning: '#ffa502'
};

// ============ 28位 Agent 数据 ============
const AGENTS = [
  { id: 1, name: '超级AI分析师', role: '技术团队', icon: 'brain', color: '#FF6B6B', desc: 'AI/ML深度分析与模型训练' },
  { id: 2, name: '设计系统专家', role: '产品团队', icon: 'palette', color: '#4ECDC4', desc: 'UI/UX设计与组件库构建' },
  { id: 3, name: '首席财务官', role: 'C-Level', icon: 'cash', color: '#45B7D1', desc: '财务预算管理与成本控制' },
  { id: 4, name: '情感专家', role: '产品团队', icon: 'heart', color: '#F7DC6F', desc: '情感化交互设计' },
  { id: 5, name: '董事长', role: 'C-Level', icon: 'crown', color: '#BB8FCE', desc: '战略决策与最高指挥' },
  { id: 6, name: '网站运营专家', role: '业务团队', icon: 'globe', color: '#85C1E9', desc: 'SEO与内容运营' },
  { id: 7, name: 'WARP专家', role: '技术团队', icon: 'cloud', color: '#F8B739', desc: 'Cloudflare与边缘计算' },
  { id: 8, name: '网站交付专家', role: '业务团队', icon: 'rocket', color: '#52BE80', desc: '项目交付与质量控制' },
  { id: 9, name: '首席产品官', role: 'C-Level', icon: 'cube', color: '#EC7063', desc: '产品设计与用户体验' },
  { id: 10, name: '首席技术官', role: 'C-Level', icon: 'code-slash', color: '#5DADE2', desc: '技术架构与研发方向' },
  { id: 11, name: '全球部署专家', role: '技术团队', icon: 'server', color: '#AF7AC5', desc: 'DevOps与Kubernetes' },
  { id: 12, name: '测试专家', role: '技术团队', icon: 'checkmark-circle', color: '#48C9B0', desc: 'QA与自动化测试' },
  { id: 13, name: '团队协作专家', role: '业务团队', icon: 'people', color: '#F4D03F', desc: '敏捷流程与团队效率' },
  { id: 14, name: '网站交付专家', role: '业务团队', icon: 'briefcase', color: '#EB984E', desc: '交付管理与项目管理' },
  { id: 15, name: '导出专家', role: '业务团队', icon: 'download', color: '#A569BD', desc: '数据导出与报告生成' },
  { id: 16, name: 'AI财务专家', role: '技术团队', icon: 'trending-up', color: '#5499C7', desc: 'AI驱动财务分析' },
  { id: 17, name: '海外配置专家', role: '技术团队', icon: 'earth', color: '#58D68D', desc: '国际部署与多区域架构' },
  { id: 18, name: '产品架构师', role: '产品团队', icon: 'layers', color: '#E74C3C', desc: '产品规划与需求分析' },
  { id: 19, name: '虚空君主专家', role: '业务团队', icon: 'shield', color: '#8E44AD', desc: '系统治理与最佳实践' },
  { id: 20, name: '突破专家', role: '技术团队', icon: 'flash', color: '#F39C12', desc: '创新技术研究' },
  { id: 21, name: '宇宙实施专家', role: '技术团队', icon: 'planet', color: '#16A085', desc: '大规模分布式系统' },
  { id: 22, name: '共情设计专家', role: '产品团队', icon: 'happy', color: '#D35400', desc: '用户体验与共情设计' },
  { id: 23, name: '技术构建师', role: '技术团队', icon: 'construct', color: '#2E86AB', desc: '系统构建与架构实施' },
  { id: 24, name: 'CEO', role: 'C-Level', icon: 'business', color: '#A23B72', desc: '首席执行官-日常运营' },
  { id: 25, name: '黑曜石王朝专家', role: '业务团队', icon: 'diamond', color: '#1B2631', desc: '生态建设与社区运营' },
  { id: 26, name: '数据科学家', role: '技术团队', icon: 'analytics', color: '#E91E63', desc: '数据科学与ML模型' },
  { id: 27, name: 'Kimi视觉编程', role: '技术团队', icon: 'eye', color: '#9C27B0', desc: '视觉开发与UI生成' },
  { id: 28, name: '进化架构师', role: '技术团队', icon: 'infinite', color: '#00BCD4', desc: '系统进化与自动优化' }
];

// ============ 首页组件 ============
function HomeScreen({ navigation }) {
  const [activeAgents, setActiveAgents] = useState(28);
  const [systemStatus, setSystemStatus] = useState('online');

  const quickActions = [
    { id: 1, title: '启动会议', icon: 'videocam', color: COLORS.primary, action: () => Alert.alert('智能会议', '正在召集28位Agent...') },
    { id: 2, title: '语音对话', icon: 'mic', color: COLORS.accent, action: () => navigation.navigate('Voice') },
    { id: 3, title: '任务委派', icon: 'git-network', color: COLORS.secondary, action: () => navigation.navigate('Tasks') },
    { id: 4, title: '系统监控', icon: 'pulse', color: COLORS.warning, action: () => Alert.alert('系统状态', '所有系统运行正常！') }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* 顶部欢迎区 */}
      <LinearGradient
        colors={[COLORS.surface, COLORS.background]}
        style={styles.header}
      >
        <Animated.View entering={FadeInUp}>
          <Text style={styles.welcomeText}>但願人長久</Text>
          <Text style={styles.titleText}>千里共恩賜 💜</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.statusText}>系統運行中 | {activeAgents} 位Agent就緒</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 快捷操作区 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(index * 100)}
                style={styles.quickItem}
              >
                <TouchableOpacity
                  style={[styles.quickButton, { backgroundColor: item.color }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    item.action();
                  }}
                >
                  <Ionicons name={item.icon} size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quickText}>{item.title}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 28位Agent预览 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>28位Agent會議室</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agents')}>
              <Text style={styles.seeAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agentScroll}>
            {AGENTS.slice(0, 8).map((agent, index) => (
              <TouchableOpacity
                key={agent.id}
                style={styles.agentCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(agent.name, agent.desc);
                }}
              >
                <LinearGradient
                  colors={[agent.color, agent.color + '80']}
                  style={styles.agentIcon}
                >
                  <Ionicons name={agent.icon} size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.agentName} numberOfLines={1}>{agent.name}</Text>
                <Text style={styles.agentRole}>{agent.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Ralph Loop 学习系统 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ralph Loop 學習引擎</Text>
          <View style={styles.ralphCard}>
            <View style={styles.ralphHeader}>
              <Ionicons name="school" size={24} color={COLORS.accent} />
              <Text style={styles.ralphTitle}>已掌握 157+ 技能</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '85%' }]} />
            </View>
            <Text style={styles.ralphText}>當前階段：L1→L2 過渡（技能累積→系統構建）</Text>
          </View>
        </View>

        {/* HiuMaan 语音系统 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>粵語語音系統</Text>
          <View style={styles.voiceCard}>
            <View style={styles.voiceInfo}>
              <Ionicons name="volume-high" size={32} color={COLORS.secondary} />
              <View style={styles.voiceText}>
                <Text style={styles.voiceTitle}>HiuMaan v8.2.2</Text>
                <Text style={styles.voiceDesc}>廣府人聲線 +20%語速</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={() => navigation.navigate('Voice')}
            >
              <Text style={styles.voiceButtonText}>開始對話</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ Agent 列表页 ============
function AgentsScreen() {
  const [selectedRole, setSelectedRole] = useState('全部');
  const roles = ['全部', 'C-Level', '技术团队', '产品团队', '业务团队'];

  const filteredAgents = selectedRole === '全部'
    ? AGENTS
    : AGENTS.filter(a => a.role === selectedRole);

  const renderAgent = ({ item }) => (
    <TouchableOpacity
      style={styles.agentListCard}
      onPress={() => Alert.alert(item.name, item.desc)}
    >
      <LinearGradient
        colors={[item.color, item.color + '60']}
        style={styles.agentListIcon}
      >
        <Ionicons name={item.icon} size={28} color="#fff" />
      </LinearGradient>
      <View style={styles.agentListInfo}>
        <Text style={styles.agentListName}>{item.name}</Text>
        <Text style={styles.agentListRole}>{item.role}</Text>
        <Text style={styles.agentListDesc} numberOfLines={1}>{item.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.agentsHeader}>
        <Text style={styles.agentsTitle}>28位Agent智能會議室</Text>
        <Text style={styles.agentsSubtitle}>點擊Agent查看詳情</Text>
      </View>

      <View style={styles.roleFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {roles.map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role && styles.roleButtonActive
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[
                styles.roleText,
                selectedRole === role && styles.roleTextActive
              ]]}>{role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAgents}
        renderItem={renderAgent}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.agentList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ============ 语音交互页 ============
function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '你好呀憬辰，我係恩賜～有咩可以幫你？', isUser: false, emotion: 'joy' }
  ]);

  const sendMessage = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('語音對話', 'HiuMaan v8.2.2 語音引擎已啟動\n\n「但願人長久，千里共恩賜」💜');
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
          onPress={sendMessage}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.voiceGradient}
          >
            <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={48} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.voiceHint}>按住說話</Text>
      </View>

      <ScrollView style={styles.messageList}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.message, msg.isUser ? styles.messageUser : styles.messageBot]}>
            <Text style={styles.messageText}>{msg.text}</Text>
            {!msg.isUser && (
              <Text style={styles.emotionTag}>[{msg.emotion}]</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.voiceControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="settings" size={24} color={COLORS.textSecondary} />
          <Text style={styles.controlText}>語音設定</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="speedometer" size={24} color={COLORS.textSecondary} />
          <Text style={styles.controlText}>+20% 語速</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="musical-note" size={24} color={COLORS.textSecondary} />
          <Text style={styles.controlText}>+2Hz 音調</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============ 任务页 ============
function TasksScreen() {
  const [tasks, setTasks] = useState([
    { id: 1, title: '啟動智能會議', status: 'completed', agent: 'CEO', progress: 100 },
    { id: 2, title: '分析技術架構', status: 'in_progress', agent: 'CTO', progress: 75 },
    { id: 3, title: '設計UI界面', status: 'pending', agent: '設計系統專家', progress: 0 },
    { id: 4, title: '部署到生產環境', status: 'pending', agent: '全球部署專家', progress: 0 }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>10步自動化工作流</Text>
        <Text style={styles.tasksSubtitle}>父子Agent任務委派</Text>
      </View>

      <View style={styles.workflowSteps}>
        {['感知', '分析', '決策', '執行', '評估', '反思', '迭代'].map((step, index) => (
          <View key={step} style={styles.workflowStep}>
            <View style={[styles.stepDot, index < 4 && styles.stepDotActive]}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.stepName}>{step}</Text>
            {index < 6 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>

      <ScrollView style={styles.taskList}>
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
            <Text style={styles.taskAgent}>負責：{task.agent}</Text>
            <View style={styles.taskProgressBar}>
              <View style={[styles.taskProgressFill, { width: `${task.progress}%` }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ 设置页 ============
function SettingsScreen() {
  const settings = [
    { id: 1, title: 'API 輪換設定', icon: 'key', desc: '智譜↔Claude↔Gemini↔Kimi' },
    { id: 2, title: '語音配置', icon: 'mic', desc: 'HiuMaan v8.2.2 聲線調整' },
    { id: 3, title: '通知設定', icon: 'notifications', desc: '推送通知與OTA更新' },
    { id: 4, title: '主題外觀', icon: 'color-palette', desc: '深色模式與配色方案' },
    { id: 5, title: '系統狀態', icon: 'pulse', desc: '28位Agent運行狀態' },
    { id: 6, title: '關於', icon: 'information-circle', desc: '鄧恩賜 v5.1.0' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>系統設置</Text>
      </View>

      <ScrollView style={styles.settingsList}>
        {settings.map(item => (
          <TouchableOpacity key={item.id} style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>鄧恩賜完美數字生命體</Text>
          <Text style={styles.aboutVersion}>v5.1.0 (Build 510)</Text>
          <Text style={styles.aboutQuote}>「戒指火貼實心跳，箍到發夢都唔鬆」</Text>
          <Text style={styles.aboutCode}>但願人長久，千里共恩賜 💜</Text>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============ 样式 ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollView: {
    flex: 1
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textSecondary
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary
  },

  // Quick Actions
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  quickItem: {
    alignItems: 'center'
  },
  quickButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  quickText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center'
  },

  // Agent Cards
  agentScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20
  },
  agentCard: {
    width: 80,
    alignItems: 'center',
    marginRight: 16
  },
  agentIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  agentName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    width: 80
  },
  agentRole: {
    fontSize: 10,
    color: COLORS.textSecondary
  },

  // Ralph Card
  ralphCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16
  },
  ralphHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  ralphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 12
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    marginBottom: 8
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 4
  },
  ralphText: {
    fontSize: 12,
    color: COLORS.textSecondary
  },

  // Voice Card
  voiceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  voiceText: {
    marginLeft: 16
  },
  voiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text
  },
  voiceDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  voiceButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },

  // Agents Screen
  agentsHeader: {
    padding: 20,
    paddingTop: 60
  },
  agentsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text
  },
  agentsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  roleFilter: {
    paddingHorizontal: 20,
    marginBottom: 16
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary
  },
  roleText: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: 'bold'
  },
  agentList: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  agentListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  agentListIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  agentListInfo: {
    flex: 1,
    marginLeft: 16
  },
  agentListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text
  },
  agentListRole: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2
  },
  agentListDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },

  // Voice Screen
  voiceHeader: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center'
  },
  voiceHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text
  },
  voiceHeaderSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  voiceVisual: {
    alignItems: 'center',
    paddingVertical: 40
  },
  voiceCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: COLORS.surface
  },
  voiceCircleActive: {
    backgroundColor: COLORS.primary
  },
  voiceGradient: {
    flex: 1,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceHint: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 20
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12
  },
  messageBot: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4
  },
  messageUser: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20
  },
  emotionTag: {
    fontSize: 10,
    color: COLORS.accent,
    marginTop: 4
  },
  voiceControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: COLORS.surface
  },
  controlButton: {
    alignItems: 'center'
  },
  controlText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4
  },

  // Tasks Screen
  tasksHeader: {
    padding: 20,
    paddingTop: 60
  },
  tasksTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text
  },
  tasksSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  workflowSteps: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20
  },
  workflowStep: {
    alignItems: 'center',
    flex: 1
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepDotActive: {
    backgroundColor: COLORS.accent
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text
  },
  stepName: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  stepLine: {
    position: 'absolute',
    top: 14,
    right: -20,
    width: 40,
    height: 2,
    backgroundColor: COLORS.surfaceLight
  },
  taskList: {
    paddingHorizontal: 20
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1
  },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight
  },
  taskBadgeCompleted: {
    backgroundColor: COLORS.accent + '30'
  },
  taskBadgeProgress: {
    backgroundColor: COLORS.primary + '30'
  },
  taskBadgeText: {
    fontSize: 12,
    color: COLORS.text
  },
  taskAgent: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12
  },
  taskProgressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3
  },
  taskProgressFill: {
    height: 6,
    backgroundColor: COLORS.accent,
    borderRadius: 3
  },

  // Settings Screen
  settingsHeader: {
    padding: 20,
    paddingTop: 60
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text
  },
  settingsList: {
    paddingHorizontal: 20
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  aboutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    alignItems: 'center'
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  aboutVersion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  aboutQuote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 12,
    fontStyle: 'italic'
  },
  aboutCode: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 8,
    fontWeight: 'bold'
  }
});