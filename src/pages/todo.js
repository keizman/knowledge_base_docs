import React from 'react';
import { useEffect, useState } from 'react';

export const TaskStatus = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed' // Changed from Failed to FAILED to maintain consistency
};

export const TaskItem = ({ task, status, children }) => (
  <div style={{
    border: '1px solid var(--ifm-color-emphasis-300)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: 'var(--ifm-card-background-color)'
  }}>
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }}>
      <h3 style={{ margin: 0 }}>{task}</h3>
      <div>
        {status === TaskStatus.PLANNED && (
          <span style={{ 
            backgroundColor: '#E2E8F0', 
            color: '#475569',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            Planned
          </span>
        )}
        {status === TaskStatus.IN_PROGRESS && (
          <span style={{ 
            backgroundColor: '#DBEAFE', 
            color: '#2563EB',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            In Progress
          </span>
        )}
        {status === TaskStatus.COMPLETED && (
          <span style={{ 
            backgroundColor: '#DCFCE7', 
            color: '#16A34A',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            Completed
          </span>
        )}
        {status === TaskStatus.FAILED && ( // Changed from Failed to FAILED
          <span style={{ 
            backgroundColor: '#FEE2E2', 
            color: '#DC2626',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            Failed
          </span>
        )}
      </div>
    </div>
    <div style={{ color: 'var(--ifm-color-emphasis-700)' }}>
      {children}
    </div>
  </div>
);

export const TaskGroup = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2>{title}</h2>
    {children}
  </div>
);

export const ProgressBar = ({ value }) => (
  <div style={{ marginBottom: '32px', marginTop: '32px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontWeight: '500' }}>Overall Progress</span>
      <span style={{ fontWeight: '500' }}>{value}%</span>
    </div>
    <div style={{ 
      height: '8px', 
      backgroundColor: 'var(--ifm-color-emphasis-200)',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        height: '100%', 
        width: `${value}%`, 
        backgroundColor: 'var(--ifm-color-primary)',
        borderRadius: '4px'
      }}></div>
    </div>
  </div>
);

export const QuickEntryTasks = () => {
  const [taskGroups, setTaskGroups] = useState([]);
  
  useEffect(() => {
    // Parse the QUICK_ENTRY_TASKS string when component mounts
    const parseQuickEntryTasks = () => {
      const result = [];
      let currentGroup = null;
      let currentTasks = [];
      let currentTask = null;
      
      // Split the string by lines and process each line
      const lines = QUICK_ENTRY_TASKS.split('\n');
      
      for (let line of lines) {
        line = line.trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Group header starts with ##
        if (line.startsWith('## ')) {
          // If we already have a group, add it to results before starting new one
          if (currentGroup) {
            // Make sure to add the last task to the current tasks
            if (currentTask) {
              currentTasks.push(currentTask);
              currentTask = null;
            }
            
            result.push({
              title: currentGroup,
              tasks: currentTasks
            });
            currentTasks = [];
          }
          currentGroup = line.substring(3).trim();
        } 
        // Task starts with - [status] - Updated to include F for Failed status
        else if (line.match(/^- \[(P|I|C|F)\] /)) {
          // If there was a previous task, add it to the list
          if (currentTask) {
            currentTasks.push(currentTask);
          }
          
          const status = line.charAt(3) === 'P' ? TaskStatus.PLANNED : 
                        line.charAt(3) === 'I' ? TaskStatus.IN_PROGRESS : 
                        line.charAt(3) === 'C' ? TaskStatus.COMPLETED :
                        TaskStatus.FAILED; // Added support for F = Failed
          
          // Extract task title - everything after status and before : or end of line
          let taskTitle = '';
          let taskDesc = '';
          
          const colonIndex = line.indexOf(':', 6);
          if (colonIndex > -1) {
            taskTitle = line.substring(6, colonIndex).trim();
            taskDesc = line.substring(colonIndex + 1).trim();
          } else {
            taskTitle = line.substring(6).trim();
          }
          
          currentTask = {
            title: taskTitle,
            status: status,
            description: taskDesc,
            subtasks: [],
            metadata: {}
          };
        }
        // Task starts with just - (no status)
        else if (line.startsWith('- ')) {
          // If there was a previous task, add it to the list
          if (currentTask) {
            currentTasks.push(currentTask);
          }
          
          // Extract task title - everything after -
          let taskTitle = line.substring(2).trim();
          
          currentTask = {
            title: taskTitle,
            status: TaskStatus.PLANNED, // Default status
            description: '',
            subtasks: [],
            metadata: {}
          };
        }
        // Subtask line starting with *
        else if (line.startsWith('* ') && currentTask) {
          const subtaskText = line.substring(2).trim();
          let subtaskStatus = 'pending'; // default status
          
          // Check if subtask has a status indicator
          if (subtaskText.startsWith('✅') || subtaskText.startsWith('☑️')) {
            subtaskStatus = 'completed';
          } else if (subtaskText.startsWith('🔄') || subtaskText.startsWith('⏳')) {
            subtaskStatus = 'in-progress';
          } else if (subtaskText.startsWith('📝')) {
            subtaskStatus = 'planned';
          }
          
          currentTask.subtasks.push({
            text: subtaskText,
            status: subtaskStatus
          });
        }
        // Metadata line starting with @
        else if (line.startsWith('@') && currentTask) {
          const parts = line.substring(1).split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            currentTask.metadata[key] = value;
          }
        }
        // Description line (indented)
        else if ((line.startsWith('  ') || line) && currentTask) {
          // Don't add empty line to description
          if (line) {
            // Append to the last task's description
            currentTask.description += (currentTask.description ? '\n' : '') + line;
          }
        }
      }
      
      // Don't forget to add the last task and group
      if (currentTask) {
        currentTasks.push(currentTask);
      }
      
      if (currentGroup) {
        result.push({
          title: currentGroup,
          tasks: currentTasks
        });
      }
      
      setTaskGroups(result);
    };
    
    parseQuickEntryTasks();
  }, []);
  
  // Helper function to render metadata
  const renderMetadata = (metadata) => {
    if (!metadata || Object.keys(metadata).length === 0) return null;
    
    return (
      <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
        {Object.entries(metadata).map(([key, value], index) => (
          <div key={index} style={{ 
            display: 'inline-block', 
            marginRight: '12px',
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '4px'
          }}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>
    );
  };
  
  // Helper function to render subtasks
  const renderSubtasks = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return null;
    
    return (
      <div style={{ marginTop: '8px' }}>
        <strong>Subtasks:</strong>
        <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '0' }}>
          {subtasks.map((subtask, index) => (
            <li key={index} style={{ 
              marginBottom: '4px',
              color: subtask.status === 'completed' ? 'var(--ifm-color-success-darkest)' : 
                    subtask.status === 'in-progress' ? 'var(--ifm-color-primary)' : 
                    'var(--ifm-font-color-base)'
            }}>
              {subtask.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <>
      {taskGroups.map((group, groupIndex) => (
        <TaskGroup key={groupIndex} title={group.title}>
          {group.tasks.map((task, taskIndex) => (
            <TaskItem key={taskIndex} task={task.title} status={task.status}>
              <div>{task.description}</div>
              {renderSubtasks(task.subtasks)}
              {renderMetadata(task.metadata)}
            </TaskItem>
          ))}
        </TaskGroup>
      ))}
    </>
  );
};

export default function TaskDashboard() {
  return (
    <div style={{ 
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: 'var(--ifm-background-surface-color)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>

      {/* <h2>Development Projects</h2> */}

      <QuickEntryTasks />
    </div>
  );
}

/**
 * QUICK_ENTRY_TASKS - A simple syntax for defining tasks and their status
 * 
 * SYNTAX GUIDE:
 * -------------
 * ## Group Title                     - Creates a new task group/section
 * 
 * - [P] Task Title: Description      - Creates a Planned task
 * - [I] Task Title: Description      - Creates an In Progress task
 * - [C] Task Title: Description      - Creates a Completed task
 * - [F] Task Title: Description      - Creates a Failed task
 * 
 * SUBTASKS:
 * * ✅ Completed subtask             - Subtask marked as completed
 * * 🔄 In progress subtask           - Subtask marked as in-progress
 * * 📝 Planned subtask               - Subtask marked as planned
 * * Regular subtask                  - Subtask without specific status
 * 
 * METADATA TAGS:
 * @progress: percentage              - Shows task completion percentage
 * @due: date                         - Shows due date
 * @priority: level                   - Shows priority level
 * @assigned: person/team             - Shows assignee
 * @version: number                   - Shows version
 * @repository: url                   - Shows repository link
 * @tools: list                       - Shows tools used
 * @team: name                        - Shows team name
 * 
 * You can add your own custom tags by using the @tag: value format
 */
const QUICK_ENTRY_TASKS = `

## Story Adapter
- [F] Auto generate noimc

  failed

## GPT API Proxy
- [I] Implementation of proxy service for GPT APIs
  * set prices
  * merge master code to local
  * 子管理员角色扩展/仿 openrouter 的平台配置
  * 想好走什么模式
  * AIGC News
  * Technical blogs
  * 快速翻译: 1.Site 2.Docs 
  * ✅ Determine update program effect for payment, 变更到写心得支付方式时 
  * memory cache and redis cache
  * aff_code
  * ✅ user's registered region
  * ✅ 已向原始 register 对齐-google register method completion
  * ✅ 本身已实现, 咱不更改/api/register /api/login autoban IP, 可配置, 默认 1小时30次, 封禁时间 3 小时, Tier 1. /api/* 是另一个独立配置, autoban IP, 可配置, 默认 1小时300次, 封禁时间 1小时(redis 存储被 ban 信息) /v1* 根据状态码 ban ip, 如果 同 IP 连续100 次 状态码为余额不足时, 默认封禁 1 小时. 这样可以做到, 如果 200 状态码的不增加数据, 不影响用户的请求性能
  * 充值方式: USDT, Paddle, Stripe, Paypal, crypto, creem
  * Playgroud - RAG button: 开启对 当前 site 问答功能, 方式为提前生成, 问答时一次性加载. 生成方式: 对布局做总结, 对文档做总结后的剔除, 要完全避免泄露隐私信息.  --猜测用户问题, 提前书写好回答
  * add LLM.txt
  * CF Settings
  * Data analysis
  * Invition aff
  @progress: 50%
  @due: 2025-04-21
  @priority: High

## Few-shot Prompt Site
- [P] Web Site contains few-shot prompt templates for various tasks
  Will include template library and performance analytics
  * ✅ Design architecture

  @progress: 10%
  @due: 2025-03


## Ask Terminal AI Tool
- [C] Command-line interface for AI queries
  ready for use
  * ✅ Core functionality
  * ✅ Command parsing
  * Add lazy mode, use natrural language to excute command then complete task
  @version: 1.0
  @repository: https://github.com/keizman/Ask-Terminal-AI



## Knowledge Base
- [C] Documentation site architecture
- [I] Add more content
  * 🔄 Template design
  * 📝 Content migration
  * Support picGo
  @progress: 10%
  @tools: Docusaurus, MDX

  
## Fine-tune asmr LLM model
- [I] Add more content
* 📝 strcture design

- [I] Find base model
  * GPT-SoVITS-WebUI
  * https://x.com/karminski3/status/1914106813206913437 偏向虚拟人


## Wechat Mini Program
- [P] Wechat Mini Program for AI queries
  * Design architecture
  * certification

  @version: 1.0
  @repository:





`;
