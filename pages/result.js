import 'semantic-ui-css/semantic.min.css'

export default function Result(){

  return (
    <>
    <h1 style = {{color:"white",borderLeft: "30px",paddingLeft: "60px",border:"solid 1px #f00", padding:"80px",backgroundColor: "black", textAlign: "center", width: "100%", height: "300px"}}>Result</h1>
    <div style = {{paddingLeft: '45px', paddingTop: '35px',float:'left'}}>
    <div class="ui card"><div class="image"><img src="https://cscommoditytips.files.wordpress.com/2017/03/bjp.jpg"/></div><div class="content"><div class="header">Bharitya Janta Party</div><div class="description">description</div></div></div>
    </div>
    <div style = {{ paddingLeft: '500px', paddingRight: '250px'}}>
    <div class="ui inverted segment">
  <div class="ui red inverted progress">
    <div class="bar">
      <div class="progress"></div>
    </div>
  </div>
  <div class="ui yellow inverted progress">
    <div class="bar">
      <div class="progress"></div>
    </div>
  </div>
  <div class="ui olive inverted progress">
    <div class="bar">
      <div class="progress"></div>
    </div>
  </div>
  <div class="ui green inverted progress">
    <div class="bar">
      <div class="progress"></div>
    </div>
  </div>
  </div>
</div>
<div style = {{paddingRight: '200px', paddingTop: '30px'}}> 
<button class="ui red button">Red</button>
<button class="ui yellow button">Yellow</button>
<button class="ui olive button">Olive</button>
<button class="ui green button">Green</button>
</div>
    </>
  )
}
