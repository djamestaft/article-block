import React, {Component} from 'react';
// import './article.css';

class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    selectedHeader(headerSize, title) {
        switch (headerSize) {
            case 'h1': 
                return <h1>{title}</h1>;
            case 'h2': 
                return <h2>{title}</h2>;
            case 'h3': 
                return <h3>{title}</h3>;
            case 'h4': 
                return <h4>{title}</h4>;
            case 'h5': 
                return <h5>{title}</h5>;
            default: 
                return <h1>{title}</h1>;
        }
    }

    render() { 
        const { 
            title, 
            author, 
            imageUrl, 
            excerpt, 
            date, 
            cat, 
            headerSize, 
            showHeader, 
            showAuthor, 
            showShare, 
            showDate, 
            showCat } = this.props;
        return (
            <div>
                {showHeader && <div>
                    {this.selectedHeader(headerSize, title)}
                </div>}

                <div className={"image-article"}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <div>
                        <img src={imageUrl}/>
                        {showShare && <button>Share</button>}
                        {showAuthor && <p>By {author}</p>}
                        <p>{showDate && <span>{date}</span>} {showCat && <span>{cat}</span>}</p>
                    </div>
                    <p>{excerpt}</p>
                </div>
            </div>
          );
    }
}
 
export default Article;