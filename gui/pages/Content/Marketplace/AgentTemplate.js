import React, {useEffect, useState} from 'react';
import Image from "next/image";
import styles from '../Tools/Tool.module.css';
import styles1 from '../Agents/Agents.module.css'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles2 from "./Market.module.css"
import EachToolOverview from "./EachToolOverview"
import {fetchAgentTemplateConfig, fetchAgentTemplateList, installAgentTemplate} from "@/pages/api/DashboardService";
import {EventBus} from "@/utils/eventBus";

export default function AgentTemplate({template}) {
    const [tools, setTools] = useState([])
    const [agentType, setAgentType] = useState('')
    const [templateModel, setTemplateModel] = useState('')
    const [rightPanel, setRightPanel] = useState('overview')
    const [goals, setGoals] = useState([])
    const [installed, setInstalled] = useState('')
    const [constraints, setConstraints] = useState([])

    useEffect(() => {
        if(template.is_installed)
            setInstalled('Installed')
        else
            setInstalled('Install')
        fetchAgentTemplateConfig(template.id)
            .then((response) => {
                const data = response.data || [];
                setAgentType(data.configs.agent_type.value)
                setTemplateModel(data.configs.model.value)
                setGoals(data.configs.goal.value)
                setConstraints(data.configs.constraints.value)
                setTools(data.configs.tools.value)
            })
            .catch((error) => {
                console.error('Error fetching template details:', error);
            });
    }, [])
    function handleInstallClick(){
        if(template.is_installed) {
            toast.error("Template is already installed", {autoClose: 1800});
            return;
        }
        installAgentTemplate(template.id)
            .then((response) => {
                toast.success("Template installed", {autoClose: 1800});
            })
            .catch((error) => {
                console.error('Error fetching template details:', error);
            });
    }
    function handleBackClick(){
        EventBus.emit('goToMarketplace', {});
    }

    return (
        <>
            <div>
                <div className="row" style={{marginLeft:'auto'}}>
                    <div className={styles2.back_button} style={{margin: '8px 0',padding: '2px'}} onClick={() => handleBackClick()}>
                        <Image src="/images/arrow_back.svg" alt="back_button" width={10} height={8}/>
                        <span className={styles2.back_button_text}>Back</span>
                    </div>
                    <div className="col-3" style={{maxHeight:'84vh',overflowY:'auto',padding:'0 8px 0 0',marginBottom:'20px;'}}>
                        <div className={styles2.left_container}>
                            <span className={styles2.top_heading}>{template.name}</span>
                            <span style={{fontSize: '12px',marginTop: '15px',}} className={styles.tool_publisher}>By SuperAGI <Image width={14} height={14} src="/images/is_verified.svg" alt="is_verified"/>&nbsp;{'\u00B7'}&nbsp;<Image width={14} height={14} src="/images/upload_icon.svg" alt="upload-icon"/></span>
                            <button className="primary_button" style={{marginTop:'15px',width:'100%'}} onClick={() => handleInstallClick()}><Image width={14} height={14} src="/images/upload_icon_dark.svg" alt="upload-icon"/>&nbsp;{installed}</button>

                            <hr className={styles2.horizontal_line} />

                            <span className={styles2.description_text}>{template.description}</span>

                            <hr className={styles2.horizontal_line} />

                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Tools</span>
                            <div className={styles1.agent_info_tools} style={{marginTop:'10px'}}>
                                {tools.map((tool, index) => (<div key={index} className="tool_container" style={{marginTop:'0',marginBottom:'5px'}}>
                                    <div className={styles1.tool_text}>{tool || ''}</div>
                                </div>))}
                            </div><br />
                            <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Agent Type</span>
                            <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                                <div className={styles1.tool_text}>{agentType}</div>
                            </div><br />
                            <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Model(s)</span>
                            <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                                <div className={styles1.tool_text}>{templateModel}</div>
                            </div>

                            <hr className={styles2.horizontal_line} />

                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Last updated</span>
                            <span className={styles2.description_text}>{template.updated_at}</span>
                        </div>
                    </div>
                    <div className="col-9" style={{paddingLeft:'0'}}>
                        {/*<div className={styles2.left_container} style={{marginBottom:'5px'}}>*/}
                        {/*    <div className="row">*/}
                        {/*        <div className="col-4">*/}
                        {/*            <button onClick={() => setRightPanel('overview')} className={styles2.tab_button} style={rightPanel === 'overview' ? {background:'#454254',paddingRight:'15px'} : {background:'transparent',paddingRight:'15px'}}>*/}
                        {/*                &nbsp;Overview*/}
                        {/*            </button>*/}
                        {/*            <button onClick={() => setRightPanel('tool_view')} className={styles2.tab_button} style={rightPanel === 'tool_view' ? {background:'#454254',paddingRight:'15px'} : {background:'transparent',paddingRight:'15px'}}>*/}
                        {/*                &nbsp;Tools Included*/}
                        {/*            </button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div style={{maxHeight:'84vh',overflowY:'auto'}}>
                            <div className={styles2.left_container} style={{marginBottom:'8px'}}>
                                <div>
                                    <span className={styles2.description_heading} style={{fontWeight:'400'}}>{goals.length}&nbsp;Goals</span><br /><br />
                                    {goals.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>
                                        <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== goals.length - 1}
                                    </div>))}
                                </div>
                            </div>
                            {/*   <div className={styles2.left_container} style={{marginBottom:'5px'}}>*/}
                            {/*    <div>*/}
                            {/*        <span className={styles2.description_heading} style={{fontWeight:'400'}}>4 Instructions</span><br /><br />*/}
                            {/*        {goals.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>*/}
                            {/*            <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== goals.length - 1 && <br/>}*/}
                            {/*        </div>))}*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className={styles2.left_container} style={{marginBottom:'8px'}}>
                                <div>
                                    <span className={styles2.description_heading} style={{fontWeight:'400'}}>{constraints.length}&nbsp;Constraints</span><br /><br />
                                    {constraints.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>
                                        <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== constraints.length - 1}
                                    </div>))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}