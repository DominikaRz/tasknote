import React, { useState, useEffect} from 'react';

function Attachement({ id, attachments }) {
    const hasImageType = Array.isArray(attachments) && attachments.some(attachment => attachment.type === "IMAGE");
    const hasOtherType = Array.isArray(attachments) && attachments.some(attachment => attachment.type !== "IMAGE");

    useEffect(() => {
      const modal = document.getElementById(`attach${id}`);
      
      const modalHandler = (event) => {
          let target = event.target;
          while (target !== modal && !target.dataset.id) {
              target = target.parentNode;
          }
          if (target.dataset.id) {
            UIkit.modal.confirm('Are you sure you want to delete this attachment?')
              .then(() => {
                  console.log('Deletion confirmed.');
              })
              .catch(error => {
                  console.warn('Deletion canceled:', error);
              });
          }
      };
      if (modal) {
          modal.addEventListener('click', modalHandler);
      }

      return () => {
          if (modal) {
              modal.removeEventListener('click', modalHandler);
          }
      };
  }, []);  // Empty dependency array ensures this runs only once when the component mounts


    return (
      <>
        <div id={`attach${id}`} uk-modal="true">
          <div className="uk-modal-dialog">
            <button className="uk-modal-close-default" type="button" uk-close="true"></button>
            <form>
            <div className="uk-modal-header">
                <h2 className="uk-modal-title">Manage attachements</h2>
            </div>
              <fieldset className="uk-fieldset">
                <div className="uk-modal-body">
                { attachments != null && (
                 hasImageType &&
                    <>
                    <div className="uk-width-1-1">
                        <h3>Delete images:</h3>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-center" style={{backgroundColor: "transparent"}}>
                        <div uk-slider="true">
                        <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex="-1">
                            <ul className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m">
                            {attachments != null && attachments.map((attachment) =>  (
                                attachment.type == 'IMAGE' && (
                                <li key={attachment.id} className="slide">
                                  <div>
                                    <canvas></canvas>
                                    <img  className="uk-blend-soft-light" src={'/files/'+ attachment.path} alt="" uk-cover="true"/>
                                    <div className="uk-position-center uk-panel">
                                          <a uk-icon="icon: trash; ratio: 1.3;"  data-id={attachment.id}
                                          onClick={() => handleDelete(category.id)} className='delete-att' ></a>
                                      </div>
                                  </div>
                                </li>
                                )
                            ))}
                            </ul>
                            <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slider-item="previous"></a>
                            <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slider-item="next"></a>
                        </div>
                        <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
                        </div>
                    </div>
                    </>
                ) }
                {attachments != null && (
                  hasOtherType && 
                    <>
                    <div className="uk-width-1-1">
                        <h3>Delete files:</h3>
                    </div>
                    <div className="uk-child-width-expand@s uk-text-left" uk-grid="true">
                        {attachments != null && attachments.map((attachment) =>  (
                            attachment.type != 'IMAGE' && (
                            <div key={attachment.id} className="uk-text-truncate">
                                <a uk-icon="icon: trash; ratio: 1;" data-id={attachment.id} //onclick="setIdImg(1)" 
                                className="uk-icon-button delete-att" onClick={() => handleDelete(category.id)}></a> 
                                {attachment.path}
                            </div>
                            )
                        ))}
                    </div>
                  </> 
                )}
                  <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                    <div className="uk-margin">
                      <legend>Add new files:</legend>
                      <div uk-form-custom="true">
                        <input type="file" aria-label="Custom controls"/>
                        <button className="uk-button uk-button-default" type="button" tabIndex="-1">Select files</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary" type="submit">Save</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </>

    );
  }
  
  export default Attachement;