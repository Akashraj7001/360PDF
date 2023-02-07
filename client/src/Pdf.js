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

    //4th page 
    
    doc.addPage();
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);  
    doc.stroke();
    doc.addFileToVFS("Helvetica-BoldOblique.ttf",font)

    doc.addFont("Helvetica-BoldOblique.ttf", "Helvetica-BoldOblique", "normal");
    doc.setFont("Helvetica-BoldOblique");
    doc.setFontSize(20);
    
    doc.text("MANAGER",35,45);
     
    let tableWidth1 = 190;
    let tableHeight1 = (5 * 20) + 20; // 7 rows * 20px per row + 20px for header
    let x1 = (doc.internal.pageSize.width / 2) - (tableWidth1 / 2) + 10;
    let y1 = (doc.internal.pageSize.height / 2) - (tableHeight1 / 2) + 10;
    
    doc.autoTable({
      head: [[' ', 'Q01','Q02','Q03']],
      body: [
        ['VALUE01', parseFloat(manager_arr[0]/manager).toFixed(2), parseFloat(manager_arr[1]/manager).toFixed(2), parseFloat(manager_arr[2]/manager).toFixed(2)],
        ['VALUE02', parseFloat(manager_arr[3]/manager).toFixed(2), parseFloat(manager_arr[4]/manager).toFixed(2), parseFloat(manager_arr[5]/manager).toFixed(2)],
        ['VALUE03', parseFloat(manager_arr[6]/manager).toFixed(2), parseFloat(manager_arr[7]/manager).toFixed(2), parseFloat(manager_arr[8]/manager).toFixed(2)],
        ['VALUE04', parseFloat(manager_arr[9]/manager).toFixed(2), parseFloat(manager_arr[10]/manager).toFixed(2), parseFloat(manager_arr[11]/manager).toFixed(2)],
        ['VALUE05', parseFloat(manager_arr[12]/manager).toFixed(2), parseFloat(manager_arr[13]/manager).toFixed(2), parseFloat(manager_arr[14]/manager).toFixed(2)]
      ],
      startY: y1,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });
   

    //5th page 

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
      head: [[' ', 'Q01','Q02','Q03']],
      body: [
        ['VALUE01', parseFloat(self_arr[0]/self).toFixed(2), parseFloat(self_arr[1]/self).toFixed(2), parseFloat(self_arr[2]/self).toFixed(2)],
        ['VALUE02', parseFloat(self_arr[3]/self).toFixed(2), parseFloat(self_arr[4]/self).toFixed(2), parseFloat(self_arr[5]/self).toFixed(2)],
        ['VALUE03', parseFloat(self_arr[6]/self).toFixed(2), parseFloat(self_arr[7]/self).toFixed(2), parseFloat(self_arr[8]/self).toFixed(2)],
        ['VALUE04', parseFloat(self_arr[9]/self).toFixed(2), parseFloat(self_arr[10]/self).toFixed(2), parseFloat(self_arr[11]/self).toFixed(2)],
        ['VALUE05', parseFloat(self_arr[12]/self).toFixed(2), parseFloat(self_arr[13]/self).toFixed(2), parseFloat(self_arr[14]/self).toFixed(2)]
      ],
      startY: y2,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });


    //6th page 


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
      head: [[' ', 'Q01','Q02','Q03']],
      body: [
        ['VALUE01', parseFloat(team_arr[0]/team).toFixed(2), parseFloat(team_arr[1]/team).toFixed(2), parseFloat(team_arr[2]/team).toFixed(2)],
        ['VALUE02', parseFloat(team_arr[3]/team).toFixed(2), parseFloat(team_arr[4]/team).toFixed(2), parseFloat(team_arr[5]/team).toFixed(2)],
        ['VALUE03', parseFloat(team_arr[6]/team).toFixed(2), parseFloat(team_arr[7]/team).toFixed(2), parseFloat(team_arr[8]/team).toFixed(2)],
        ['VALUE04', parseFloat(team_arr[9]/team).toFixed(2), parseFloat(team_arr[10]/team).toFixed(2), parseFloat(team_arr[11]/team).toFixed(2)],
        ['VALUE05', parseFloat(team_arr[12]/team).toFixed(2), parseFloat(team_arr[13]/team).toFixed(2), parseFloat(team_arr[14]/team).toFixed(2)]
      ],
      startY: y3,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });



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
      head: [[' ', 'Q01','Q02','Q03']],
      body: [
        ['VALUE01', parseFloat(client_arr[0]/client).toFixed(2), parseFloat(client_arr[1]/client).toFixed(2), parseFloat(client_arr[2]/client).toFixed(2)],
        ['VALUE02', parseFloat(client_arr[3]/client).toFixed(2), parseFloat(client_arr[4]/client).toFixed(2), parseFloat(client_arr[5]/client).toFixed(2)],
        ['VALUE03', parseFloat(client_arr[6]/client).toFixed(2), parseFloat(client_arr[7]/client).toFixed(2), parseFloat(client_arr[8]/client).toFixed(2)],
        ['VALUE04', parseFloat(client_arr[9]/client).toFixed(2), parseFloat(client_arr[10]/client).toFixed(2), parseFloat(client_arr[11]/client).toFixed(2)],
        ['VALUE05', parseFloat(client_arr[12]/client).toFixed(2), parseFloat(client_arr[13]/client).toFixed(2), parseFloat(client_arr[14]/client).toFixed(2)]
      ],
      startY: y4,
      styles: {
        headStyles: {
          halign: 'center'
        }
      }
    });

   

  //8th page
  
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
    head: [[' ', 'Q01','Q02','Q03']],
    body: [
      ['VALUE01', parseFloat(peer_arr[0]/peer).toFixed(2), parseFloat(peer_arr[1]/peer).toFixed(2), parseFloat(peer_arr[2]/peer).toFixed(2)],
      ['VALUE02', parseFloat(peer_arr[3]/peer).toFixed(2), parseFloat(peer_arr[4]/peer).toFixed(2), parseFloat(peer_arr[5]/peer).toFixed(2)],
      ['VALUE03', parseFloat(peer_arr[6]/peer).toFixed(2), parseFloat(peer_arr[7]/peer).toFixed(2), parseFloat(peer_arr[8]/peer).toFixed(2)],
      ['VALUE04', parseFloat(peer_arr[9]/peer).toFixed(2), parseFloat(peer_arr[10]/peer).toFixed(2), parseFloat(peer_arr[11]/peer).toFixed(2)],
      ['VALUE05', parseFloat(peer_arr[12]/peer).toFixed(2), parseFloat(peer_arr[13]/peer).toFixed(2), parseFloat(peer_arr[14]/peer).toFixed(2)]
    ],
    startY: y5,
    styles: {
      headStyles: {
        halign: 'center'
      }
    }
  }); 











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
