import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import  {font} from './Common/Fonts';
import logo from './Assets/company_logo.jpeg';
import 'jspdf-autotable';
import './index.css'; 

export default function Pdf() {
  const [userData, setUserData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user`);
      let totalFeedBacks=response.data.length;
     
      console.log(response.data)
      console.log(totalFeedBacks);
      console.log(response.data[0]._id);
    
      let role_length=response.data[0].role.length;
      console.log(role_length);
      console.log(response.data[0].empname);
      console.log(response.data[0].role[0]);
      console.log(response.data[0].value[0]);
      console.log(response.data[0].role[1]);
      console.log(response.data[0].value[1]);
      let val_size=response.data[0].value[0].length;
      console.log(val_size);
      console.log(response.data[0].value[0][0]);
    
      //
      


      setUserData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  


  const generatePDF = (index) => {



    const roleCount = userData[index].role.length;
    let self=0,team=0,manager=0,peer=0,client=0;
    for(let i=0;i<roleCount;i++){
      if(userData[index].role[i]==="Manager"){
              manager++;
      }
      else if(userData[index].role[i]==="client"){
        client++;
      }
      else if(userData[index].role[i]==="self"){
        self++;
      }
      else if(userData[index].role[i]==="peer"){
        peer++;
      }
      else{
        team++
      }
    }


    let manager_arr=Array(15).fill(0);
    let client_arr=Array(15).fill(0);
    let self_arr=Array(15).fill(0);
    let peer_arr=Array(15).fill(0);
    let team_arr=Array(15).fill(0);



    for(let i=0;i<roleCount;i++){
      if(userData[index].role[i]==='Manager'){
        for(let j=0;j<15;j++){
          manager_arr[j]+=Number(userData[index].value[i][j]);
        }
      }
      else if(userData[index].role[i]==='client'){
        for(let j=0;j<15;j++){
          client_arr[j]+=Number(userData[index].value[i][j]);
        }
      }
      else if(userData[index].role[i]==='self'){
        for(let j=0;j<15;j++){
          self_arr[j]+=Number(userData[index].value[i][j]);
        }
      }
      else if(userData[index].role[i]==='peer'){
        for(let j=0;j<15;j++){
          peer_arr[j]+=Number(userData[index].value[i][j]);
        }
      } 
      else{
        for(let j=0;j<15;j++){
          team_arr[j]+=Number(userData[index].value[i][j]);
        }
      }
    }

  for(let i=0;i<15;i++){
    manager_arr[i]/=manager;
    client_arr[i]/=client;
    self_arr[i]/=self;
    team_arr[i]/=team;
    peer_arr[i]/=peer;
  }


    let m_arr=[];
    let t_arr=[];
    let s_arr=[];
    let p_arr=[];
    let c_arr=[];


    for(let i=0;i<15;i+=3){
      let sum=parseFloat((manager_arr[i]+manager_arr[i+1]+manager_arr[i+2])/3).toFixed(2);
      let sum1=parseFloat((client_arr[i]+client_arr[i+1]+client_arr[i+2])/3).toFixed(2);
      let sum2=parseFloat((team_arr[i]+team_arr[i+1]+team_arr[i+2])/3).toFixed(2);
      let sum3=parseFloat((peer_arr[i]+peer_arr[i+1]+peer_arr[i+2])/3).toFixed(2);
      let sum4=parseFloat((self_arr[i]+self_arr[i+1]+self_arr[i+2])/3).toFixed(2);
      m_arr.push(sum);
      c_arr.push(sum1);
      t_arr.push(sum2);
      p_arr.push(sum3);
      s_arr.push(sum4);
    }

  

    //pdf generation using dynamic data
    //1st page
   
    const doc = new jsPDF();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.setFillColor(51, 153, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    doc.addImage(logo,'JPEG',0,0,50,30);
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)

    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(40);
   
    doc.text("360 Degree",50,85);
   
    doc.text("Feedback Report",50,110);
    

    doc.setFontSize(20);
    doc.text(`Report of:    ${userData[index].empname}`,55,145);
   doc.text(`Empolyee Id:  ${userData[index]._id}`,55,160);
   
    let date=new Date().toLocaleDateString();
    doc.text(`Date:${date}`,55,195);

//2nd page

    doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
   

    
    let tableWidth = 190;
    let tableHeight = (7 * 20) + 20; // 7 rows * 20px per row + 20px for header
    let x = (doc.internal.pageSize.width / 2) - (tableWidth / 2) + 10;
    let y = (doc.internal.pageSize.height / 2) - (tableHeight / 2) + 10;
    
    doc.autoTable({
      head: [['REPORT SUMMERY', ' ']],
      body: [
        ['Number of evaluation invited', ''],
        ['Number of evaluation received', roleCount ],
        ['Number of self evaluation received', self],
        ['Number of manager evaluation received', manager],
        ['Number of peer evaluation received', peer],
        ['Number of team evaluation received', team],
        ['Number of client evaluation received', client]
      ],
      startY: y,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });
    


    //3rd page


   doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)

    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(40);
    
    doc.text("VALUES",75,85);

    //4th page manager table


   if(manager>0){
    

    doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)

    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(20);
    
    doc.text("MANAGER",35,45);
     
    let tableWidth1 = 90;
    let tableHeight1 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
    let x1 = (doc.internal.pageSize.width / 2) - (tableWidth1 / 2) + 10;
    let y1 = (doc.internal.pageSize.height / 2) - (tableHeight1 / 2) + 10;
   
    let combinedBody = [];

for (let i = 0; i < m_arr.length; i++) {
  combinedBody.push([    `VALUE0${i + 1}`,    m_arr[i] > 0 && m_arr[i] < 3 ? { content: m_arr[i], styles: { fillColor: [255, 0, 0], textColor: [255, 255, 255] } } : ' ',
    m_arr[i] >= 3 && m_arr[i] < 4 ? { content: m_arr[i], styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',
    m_arr[i] >= 4 && m_arr[i] <= 5 ? { content: m_arr[i], styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } } : ' ',
    s_arr[i] > 0 && s_arr[i] < 3 ? { content: s_arr[i], styles: { fillColor: [255, 0, 0], textColor: [255, 255, 255] } } : ' ',
    s_arr[i] >= 3 && s_arr[i] < 4 ? { content: s_arr[i], styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',
    s_arr[i] >= 4 && s_arr[i] <= 5 ? { content: s_arr[i], styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } } : ' '
  ]);
}

doc.autoTable({
  head: [[' ', 'Area of Development (m_arr)', 'Strength (m_arr)', 'Role Model (m_arr)', 'Area of Development (s_arr)', 'Strength (s_arr)', 'Role Model (s_arr)']],
  body: combinedBody,
  startY: y1,
  styles: {
    headStyles: {
      halign: 'center'
    }
  }
});

    
    
    
   }
    
    
    //5th page slef table

    if(self>0){


      doc.addPage();
      doc.setLineWidth(1);
      doc.rect(10, 10, 190, 277);  
      doc.stroke();
      doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)
  
      doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
      doc.setFont("Helvetica-BoldOblique");
      doc.setFontSize(20);
      
      doc.text("SELF",35,45);
       
      let tableWidth2 = 190;
      let tableHeight2 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
      let x2 = (doc.internal.pageSize.width / 2) - (tableWidth2 / 2) + 10;
      let y2 = (doc.internal.pageSize.height / 2) - (tableHeight2 / 2) + 10;

      doc.autoTable({
        head: [[' ', 'Area of Development', 'Strength', 'Role Model']],
        body: [
          ...s_arr.map((value, index) => [
            `VALUE0${index + 1}`,
            value > 0 && value < 3 ? { content: value, styles: { fillColor: [255, 0, 0], textColor: [255, 255, 255] } } : ' ',
            value >= 3 && value < 4 ? { content: value, styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',
            value >= 4 && value <= 5 ? { content: value, styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } } : ' '
          ]),
         
        ],
        startY: y2,
        styles: {
          headStyles: {
            halign: 'center'
          }
        }
      });

    }

  

    //6th page team table

    if(team>0){

      doc.addPage();
      doc.setLineWidth(1);
      doc.rect(10, 10, 190, 277);  
      doc.stroke();
      doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)
  
      doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
      doc.setFont("Helvetica-BoldOblique");
      doc.setFontSize(20);
      
      doc.text("TEAM",35,45);
       
      let tableWidth3 = 190;
      let tableHeight3 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
      let x3 = (doc.internal.pageSize.width / 2) - (tableWidth3 / 2) + 10;
      let y3 = (doc.internal.pageSize.height / 2) - (tableHeight3 / 2) + 10;
  
                         
      doc.autoTable({
        head: [[' ', 'Area of Development', 'Strength', 'Role Model']],
        body: [
          ...t_arr.map((value, index) => [
            `VALUE0${index + 1}`,
            value > 0 && value < 3 ? { content: value, styles: { fillColor: [255, 0, 0], textColor: [255, 255, 255] } } : ' ',
            value >= 3 && value < 4 ? { content: value, styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',
            value >= 4 && value <= 5 ? { content: value, styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } } : ' '
          ]),
         
        ],
        startY: y3,
        styles: {
          headStyles: {
            halign: 'center'
          }
        }
      });
      

    }


    //7th page 


    doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)

    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(20);
    
    doc.text("CLIENT",35,45);
     
    let tableWidth4 = 190;
    let tableHeight4 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
    let x4 = (doc.internal.pageSize.width / 2) - (tableWidth4 / 2) + 10;
    let y4 = (doc.internal.pageSize.height / 2) - (tableHeight4 / 2) + 10;
    
    doc.autoTable({
      head: [[' ', 'Area of Development', 'Strength', 'Role Model']],
      body: [
        ...c_arr.map((value, index) => [
          `VALUE0${index + 1}`,
          value > 0 && value < 3 ? { content: value, styles: { fillColor: [255, 0, 0], textColor: [255, 255, 255] } } : ' ',
          value >= 3 && value < 4 ? { content: value, styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',
          value >= 4 && value <= 5 ? { content: value, styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } } : ' '
        ]),
       
      ],
      startY: y4,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });
    
   

  //8th page


  if(peer>0){


    doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)
  
    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(20);
    
    doc.text("PEER",35,45);
     
    let tableWidth5 = 190;
    let tableHeight5 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
    let x5 = (doc.internal.pageSize.width / 2) - (tableWidth5 / 2) + 10;
    let y5 = (doc.internal.pageSize.height / 2) - (tableHeight5 / 2) + 10;
    
                     
    doc.autoTable({
      head: [[' ', 'Area of  Developement','Strength','Role Model']],
      body: p_arr.map((value, index) => {
        return [      `VALUE0${index + 1}`,      value > 0 && value < 3 ? { content: value, styles: {  textColor: [255, 255, 255] } } : ' ',  
            value >= 3 && value < 4 ? { content: value, styles: { fillColor: [255, 255, 0], textColor: [0, 0, 0] } } : ' ',    
            value >= 4 && value <=5 ? { content: value, styles: { fillColor: [0, 255, 0], textColor: [255, 255, 255] } }  : ' '    ];
      }),
      startY: y5,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });
    

  }
  
    doc.save(`${userData[index].empname} Report.pdf`);
  }

  const handleDropdownChange = (event) => {
    setSelectedId(event.target.value);
  }

  return (


    <>
    
  
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      marginTop: '0px',
      backgroundColor: 'lightgray', 
      padding: '200px' 
    }}>
      <select onChange={handleDropdownChange} style={{ 
        width: '200px', 
        height: '30px', 
        marginBottom: '60px',
        borderRadius: '5px',
        border: '1px solid black'
      }}>
        <option value={null}>Select an Empolyee Id</option>
        {userData.map((item, index) => (
          <option key={index} value={index}>{item._id}</option>
        ))}
      </select>
      {selectedId !== null && (
        <button onClick={() => generatePDF(selectedId)} style={{ 
          width: '100px', 
          height: '30px',
          backgroundColor: 'lightblue',
          color: 'white',
          borderRadius: '150px',
          border: '1px solid black'
        }}>Download PDF</button>
      )}
    </div>
    </>
  );
}
