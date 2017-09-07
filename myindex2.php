<?php

class Item {
	private $text;
	private $img;
	private $action;
	private $mysqli;
	private $imageFileType;
	private $imageSourcePath;

	public function getAction(){
		return $this->action;
	}

	public function __construct() {
		$this->init();
	}

	public function init(){	
		$data = $_POST;
		$this->text = isset($data['text'])?$data['text']:"";
		$this->img = isset($data['src'])?$data['src']:"";
		$this->id = isset($data['id'])?$data['id']:"";
		$this->action = $data['action'];
		$this->imageFileType = array("jpg","png","jpeg","gif");
		$this->connectDB();
	}

	public function connectDB(){
		$user_name = "root";
		$password = "root";
		$database = "test";
		$server = "127.0.0.1";

		$this->mysqli = new mysqli($server, $user_name, $password, $database);
		if ($this->mysqli->connect_errno) {
   			printf("Connect failed: %s\n", $this->mysqli->connect_error);
    		exit();
		}
	}

	private function exec($sql){

    	$data = array();
    	$items = array();
    	if($this->action == 'show'){
			if ($result = $this->mysqli->query($sql)) {
				$data = array('num_rows' => $result->num_rows);
				while ($row = $result->fetch_assoc()) {
	        		$item = array("id" => $row["id"], "text" => $row["text"], "img" => $row["img"], "flag" => $row["flag"]);
	        		$items[] = $item;
	        	}
	        	$result->free();
	        	$data["items"] = $items;
	    	}
    	} else {
    		$result = $this->mysqli->query($sql);
    		
    		if($result){

    			if($this->action == 'add'){
    				$data = array('num_rows' => $_POST["counter"]);
    				$item = array("id" => $this->mysqli->insert_id, "text" => $this->text, "img" => $this->img, "flag" => $_POST["flag"]);
				} else if($this->action == 'delete'){
					$item = array("id" => $this->id);
				} else if($this->action == 'edit'){
					$item = array("id" => $this->id, "text" => $this->text, "img" => $this->img);
				} else {
					$item = array("action" => "sortupdate");
				}
				$items[] = $item;
				$data["items"] = $items;
    		}
    	}
    	return $data;

	}

	public function show(){

    	$sql = "SELECT * FROM item ORDER BY flag";
    	$data = $this->exec($sql);
    	$myjson = json_encode($data);
    	echo $myjson;
	}


	public function add(){
		$filename = __dir__ ."/". $this->img;
		if(file_exists($filename)){
			$imgextension = pathinfo($this->img,PATHINFO_EXTENSION);
			if(in_array($imgextension, $this->imageFileType)) {
				$flag = $_POST["flag"];
				$sql = "INSERT INTO item (text, img, flag) VALUES ('".$this->text."', '".$this->img."',". $flag .")";
				$data = $this->exec($sql);
				$myjson = json_encode($data);
		    	echo $myjson;
	    	}else{
	    		$returnText = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	    		$myjson = json_encode(array('error' => $returnText));
	    		echo $myjson;
	    	}
	    } else {
    		$returnText = "The image loaded not exists.";
    		$myjson = json_encode(array('error' => $returnText));
    		echo $myjson;
	    }
	}	

	public function delete(){
		$id = $_POST["id"];
		$sql = "DELETE FROM item  WHERE id = ".$id;
		
		$data = $this->exec($sql);
		$myjson = json_encode($data);
    	echo $myjson;		
	}

	public function edit(){
		$newsrc = $_POST["newsrc"];
		$newtext = $_POST["newtext"];
		$filename = __dir__ ."/". $newsrc;
		if(file_exists($filename)){

			$imgextension = pathinfo($newsrc,PATHINFO_EXTENSION);
			if(in_array($imgextension, $this->imageFileType)) {
				$sql = "UPDATE item SET text = '".$newtext."', img = '".$newsrc."' WHERE id = ".$this->id;
				$this->img = $newsrc;
				$this->text = $newtext;
				$data = $this->exec($sql);
				$myjson = json_encode($data);
				echo $myjson;
			}else{
	    		$returnText = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	    		$myjson = json_encode(array('error' => $returnText));
	    		echo $myjson;
	    	}
	    }else{
    		$returnText = "The image loaded not exists.";
    		$myjson = json_encode(array('error' => $returnText));
    		echo $myjson;	    	
	    }
	}

	public function sortupdate(){
		$data = $_POST;
		$items = $_POST["items"];
		$len = count($items);
		$update = "UPDATE item SET flag = CASE id";
		foreach($items as $item){
			$update = $update . " WHEN ". $item["id"] . " THEN ". $item["pos"];
		}
		$update = $update . " END WHERE id IN (";
		foreach($items as $item){
			if($len == $item["pos"]){
				$update = $update . $item["id"] . ")";
			}else{
				$update = $update . $item["id"] . ", ";
			}
		}
		$data = $this->exec($update);
		$myjson = json_encode($data);
	    echo $myjson;
	}


}

$item = new Item();

switch ($item->getAction()) {
	case 'add':
		$item->add();
		break;
	case 'delete':
		$item->delete();
		break;
	case 'edit':
		$item->edit();
		break;
	case 'show':
		$item->show();
		break;
	case 'sortupdate':
		$item->sortupdate();
}
